package request_report

import (
	"github.com/go-playground/validator/v10"
)

type CreateReportReq struct {
	Template string `json:"template" validate:"required,min=1"`
	UserMail string `json:"user_mail" validate:"required,email"`
}

type TurnOnOffReq struct {
	ID      int  `json:"id" validate:"required,gt=0"`
	Version int  `json:"version" validate:"required,gt=0"`
	Active  bool `json:"active"`
}

type UpdateReportReq struct {
	ID       int    `json:"id" validate:"required,gt=0"`
	Template string `json:"template" validate:"required,min=1"`
}

type ListReportsReq struct {
	Page     int `json:"page"`
	PageSize int `json:"page_size"`
}

type FilterReportParams struct {
	ID       int     `json:"id"`
	UserMail *string `json:"user_mail"`
	Page     int     `json:"page"`
	PageSize int     `json:"page_size"`
}

var validate = validator.New()

func Validate(i any) error {
	return validate.Struct(i)
}
