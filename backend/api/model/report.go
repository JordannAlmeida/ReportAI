package model

import "time"

// Report represents the Report table in the database.
type Report struct {
	ID       int       `json:"id"`
	Template string    `json:"template"`
	UserMail string    `json:"user_mail"`
	Active   bool      `json:"active"`
	CreateAt time.Time `json:"create_at"`
	UpdateAt time.Time `json:"update_at"`
}
