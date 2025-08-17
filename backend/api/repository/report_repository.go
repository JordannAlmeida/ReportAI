package repository

import (
	"context"
	"database/sql"
	"errors"
	"reportia/model"
)

var ErrReportInactive = errors.New("the report that you select was inactive")

type ReportRepository struct {
	db *sql.DB
}

func NewReportRepository(db *sql.DB) *ReportRepository {
	return &ReportRepository{db: db}
}

func (r *ReportRepository) List(ctx context.Context) ([]model.Report, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT id, template, user_mail, active, create_at, update_at FROM Report`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reports []model.Report = make([]model.Report, 0)
	for rows.Next() {
		var rep model.Report
		if err := rows.Scan(&rep.ID, &rep.Template, &rep.UserMail, &rep.Active, &rep.CreateAt, &rep.UpdateAt); err != nil {
			return nil, err
		}
		reports = append(reports, rep)
	}
	return reports, nil
}

func (r *ReportRepository) Filter(ctx context.Context, id int, userMail *string) (*model.Report, error) {
	var rep model.Report
	query := `SELECT id, template, user_mail, active, create_at, update_at FROM Report WHERE id = $1`
	args := []interface{}{id}

	if userMail != nil {
		query += " AND user_mail = $2"
		args = append(args, *userMail)
	}

	row := r.db.QueryRowContext(ctx, query, args...)
	if err := row.Scan(&rep.ID, &rep.Template, &rep.UserMail, &rep.Active, &rep.CreateAt, &rep.UpdateAt); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	if !rep.Active {
		return nil, ErrReportInactive
	}
	return &rep, nil
}

func (r *ReportRepository) Create(ctx context.Context, template, userMail string) (*model.Report, error) {
	var rep model.Report
	err := r.db.QueryRowContext(ctx, `INSERT INTO Report (template, user_mail, active) VALUES ($1, $2, true) RETURNING id, template, user_mail, active, create_at, update_at`, template, userMail).Scan(&rep.ID, &rep.Template, &rep.UserMail, &rep.Active, &rep.CreateAt, &rep.UpdateAt)
	if err != nil {
		return nil, err
	}
	return &rep, nil
}

func (r *ReportRepository) Update(ctx context.Context, id int, template string) (*model.Report, error) {
	var rep model.Report
	err := r.db.QueryRowContext(ctx, `UPDATE Report SET template = $1, update_at = CURRENT_DATE WHERE id = $2 RETURNING id, template, user_mail, active, create_at, update_at`, template, id).Scan(&rep.ID, &rep.Template, &rep.UserMail, &rep.Active, &rep.CreateAt, &rep.UpdateAt)
	if err != nil {
		return nil, err
	}
	return &rep, nil
}

func (r *ReportRepository) TurnOnOff(ctx context.Context, id int, active bool) error {
	res, err := r.db.ExecContext(ctx, `UPDATE Report SET active = $1 WHERE id = $2`, active, id)
	if err != nil {
		return err
	}
	n, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if n == 0 {
		return sql.ErrNoRows
	}
	return nil
}
