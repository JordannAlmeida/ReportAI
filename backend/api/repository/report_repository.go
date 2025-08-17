package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
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
	return r.ListWithPagination(ctx, 1, 1000) // Default behavior for backward compatibility
}

func (r *ReportRepository) ListWithPagination(ctx context.Context, page, pageSize int) ([]model.Report, error) {
	offset := (page - 1) * pageSize

	rows, err := r.db.QueryContext(ctx,
		`SELECT id, template, user_mail, active, create_at, update_at 
		 FROM Report 
		 ORDER BY create_at DESC 
		 LIMIT $1 OFFSET $2`,
		pageSize, offset)
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

func (r *ReportRepository) GetTotalCount(ctx context.Context) (int, error) {
	var count int
	err := r.db.QueryRowContext(ctx, `SELECT COUNT(*) FROM Report`).Scan(&count)
	return count, err
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

func (r *ReportRepository) FilterWithPagination(ctx context.Context, id int, userMail *string, page, pageSize int) ([]model.Report, int, error) {
	offset := (page - 1) * pageSize

	baseQuery := `FROM Report WHERE id = $1`
	args := []interface{}{id}

	if userMail != nil {
		baseQuery += " AND user_mail = $2"
		args = append(args, *userMail)
	}

	// Get total count
	var totalCount int
	countQuery := "SELECT COUNT(*) " + baseQuery
	err := r.db.QueryRowContext(ctx, countQuery, args...).Scan(&totalCount)
	if err != nil {
		return nil, 0, err
	}

	// Get paginated results
	selectQuery := "SELECT id, template, user_mail, active, create_at, update_at " +
		baseQuery + " ORDER BY create_at DESC LIMIT $" +
		fmt.Sprintf("%d", len(args)+1) + " OFFSET $" + fmt.Sprintf("%d", len(args)+2)
	args = append(args, pageSize, offset)

	rows, err := r.db.QueryContext(ctx, selectQuery, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var reports []model.Report = make([]model.Report, 0)
	for rows.Next() {
		var rep model.Report
		if err := rows.Scan(&rep.ID, &rep.Template, &rep.UserMail, &rep.Active, &rep.CreateAt, &rep.UpdateAt); err != nil {
			return nil, 0, err
		}
		if !rep.Active {
			return nil, 0, ErrReportInactive
		}
		reports = append(reports, rep)
	}

	return reports, totalCount, nil
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
