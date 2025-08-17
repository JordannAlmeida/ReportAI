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

var validate = validator.New()

func Validate(i any) error {
	return validate.Struct(i)
}
