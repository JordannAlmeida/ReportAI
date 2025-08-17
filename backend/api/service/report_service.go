package service

import (
	"context"
	"errors"
	"io"
	"reportia/helper"
	"reportia/integration/google"
	"reportia/model"
	const_model "reportia/model/const"
	"reportia/repository"
)

type ReportService struct {
	repo      *repository.ReportRepository
	geminiApi *google.GeminiAPI
}

func NewReportService(repo *repository.ReportRepository, geminiApi *google.GeminiAPI) *ReportService {
	return &ReportService{repo: repo, geminiApi: geminiApi}
}

func (s *ReportService) List(ctx context.Context) ([]model.Report, error) {
	return s.repo.List(ctx)
}

func (s *ReportService) ListWithPagination(ctx context.Context, page, pageSize int) (*model.PaginatedReports, error) {
	if page <= 0 {
		page = 1
	}
	if pageSize <= 0 {
		pageSize = 10
	}
	if pageSize > 100 {
		pageSize = 100
	}

	reports, err := s.repo.ListWithPagination(ctx, page, pageSize)
	if err != nil {
		return nil, err
	}

	totalCount, err := s.repo.GetTotalCount(ctx)
	if err != nil {
		return nil, err
	}

	totalPages := (totalCount + pageSize - 1) / pageSize

	return &model.PaginatedReports{
		Reports:    reports,
		TotalCount: totalCount,
		Page:       page,
		PageSize:   pageSize,
		TotalPages: totalPages,
	}, nil
}

func (s *ReportService) Filter(ctx context.Context, id int, userMail *string) (*model.Report, error) {
	rep, err := s.repo.Filter(ctx, id, userMail)
	if err == repository.ErrReportInactive {
		return nil, errors.New("the report that you select was inactive")
	}
	return rep, err
}

func (s *ReportService) FilterWithPagination(ctx context.Context, id int, userMail *string, page, pageSize int) (*model.PaginatedReports, error) {
	if page <= 0 {
		page = 1
	}
	if pageSize <= 0 {
		pageSize = 10
	}
	if pageSize > 100 {
		pageSize = 100
	}

	reports, totalCount, err := s.repo.FilterWithPagination(ctx, id, userMail, page, pageSize)
	if err == repository.ErrReportInactive {
		return nil, errors.New("the report that you select was inactive")
	}
	if err != nil {
		return nil, err
	}

	totalPages := (totalCount + pageSize - 1) / pageSize

	return &model.PaginatedReports{
		Reports:    reports,
		TotalCount: totalCount,
		Page:       page,
		PageSize:   pageSize,
		TotalPages: totalPages,
	}, nil
}

func (s *ReportService) Create(ctx context.Context, template, userMail string) (*model.Report, error) {
	if template == "" || userMail == "" {
		return nil, errors.New("template and user_mail are required")
	}
	template = helper.RemoveAllSpacesAndBreakingLines(template)
	return s.repo.Create(ctx, template, userMail)
}

func (s *ReportService) Update(ctx context.Context, id int, template string) (*model.Report, error) {
	if id == 0 || template == "" {
		return nil, errors.New("id and template are required")
	}
	template = helper.RemoveAllSpacesAndBreakingLines(template)
	return s.repo.Update(ctx, id, template)
}

func (s *ReportService) TurnOnOff(ctx context.Context, id int, active bool) error {
	if id == 0 {
		return errors.New("id is required")
	}
	return s.repo.TurnOnOff(ctx, id, active)
}

func (s *ReportService) GenerateReportFromFile(ctx context.Context, idReportTemplate int, promptUser string, model string, file io.Reader, fileName string, fileType string) (string, error) {
	if file == nil || fileName == "" || fileType == "" {
		return "", errors.New("file, fileName and fileType are required")
	}
	reportModel, err := s.repo.Filter(ctx, idReportTemplate, nil)
	if err != nil {
		return "", err
	}
	if reportModel == nil {
		return "", errors.New("report not found")
	}
	promptToLLM := const_model.GetPromptToGenerateAnalysisFromFile(reportModel.Template, promptUser)
	responseLLM, err := s.geminiApi.GenerateAnalisysFromReportFile(ctx, promptToLLM, model, file, fileName, fileType)
	if err != nil {
		return "", err
	}
	responseLLMWithoutSpecialBlockingLLMCharacters := helper.RemoveSpecialBlockingLLMCharacters(responseLLM)
	htmlReport, err := helper.FormatHTML(responseLLMWithoutSpecialBlockingLLMCharacters)
	if err != nil {
		return "", errors.New("error formatting HTML: " + err.Error())
	}
	return htmlReport, nil
}
