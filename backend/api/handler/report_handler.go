package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	request_report "reportia/model/request"
	"reportia/service"
	"strconv"
)

const maxUploadSize = 10 * 1024 * 1024 //  10 MB

type ReportHandler struct {
	service *service.ReportService
}

func NewReportHandler(s *service.ReportService) *ReportHandler {
	return &ReportHandler{service: s}
}

// List godoc
// @Summary List reports
// @Description Get all reports with pagination
// @Tags reports
// @Produce json
// @Param page query int false "Page number (default: 1)"
// @Param page_size query int false "Page size (default: 10, max: 100)"
// @Success 200 {object} model.PaginatedReports
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /api/v1/reports [get]
func (h *ReportHandler) List(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	page, _ := strconv.Atoi(q.Get("page"))
	pageSize, _ := strconv.Atoi(q.Get("page_size"))

	if page <= 0 {
		page = 1
	}
	if pageSize <= 0 {
		pageSize = 10
	}

	paginatedReports, err := h.service.ListWithPagination(r.Context(), page, pageSize)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	enc := json.NewEncoder(w)
	enc.SetEscapeHTML(false)
	enc.Encode(paginatedReports)
}

// Filter godoc
// @Summary Filter reports
// @Description Get reports by id and user_mail with pagination
// @Tags reports
// @Produce json
// @Param id query int true "Report ID"
// @Param user_mail query string false "User Email"
// @Param page query int false "Page number (default: 1)"
// @Param page_size query int false "Page size (default: 10, max: 100)"
// @Success 200 {object} model.PaginatedReports
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 422 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /api/v1/reports/filter [get]
func (h *ReportHandler) Filter(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	id, _ := strconv.Atoi(q.Get("id"))
	page, _ := strconv.Atoi(q.Get("page"))
	pageSize, _ := strconv.Atoi(q.Get("page_size"))

	if id == 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "id is required"})
		return
	}

	if page <= 0 {
		page = 1
	}
	if pageSize <= 0 {
		pageSize = 10
	}

	var userMail *string
	if q.Get("user_mail") != "" {
		val := q.Get("user_mail")
		userMail = &val
	} else {
		userMail = nil
	}

	paginatedReports, err := h.service.FilterWithPagination(r.Context(), id, userMail, page, pageSize)
	if err != nil {
		if err.Error() == "the report that you select was inactive" {
			w.WriteHeader(http.StatusUnprocessableEntity)
		} else {
			w.WriteHeader(http.StatusInternalServerError)
		}
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	if len(paginatedReports.Reports) == 0 {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "report not found"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	enc := json.NewEncoder(w)
	enc.SetEscapeHTML(false)
	enc.Encode(paginatedReports)
}

// Create godoc
// @Summary Create report
// @Description Create a new report
// @Tags reports
// @Accept json
// @Produce json
// @Param report body request_report.CreateReportReq true "Create Report Request"
// @Success 200 {object} model.Report
// @Failure 400 {object} map[string]string
// @Router /api/v1/reports [post]
func (h *ReportHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req request_report.CreateReportReq

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid body"})
		return
	}

	if err := request_report.Validate(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	rep, err := h.service.Create(r.Context(), req.Template, req.UserMail)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}
	enc := json.NewEncoder(w)
	enc.SetEscapeHTML(false)
	enc.Encode(rep)
}

// Update godoc
// @Summary Update report
// @Description Update an existing report
// @Tags reports
// @Accept json
// @Produce json
// @Param report body request_report.UpdateReportReq true "Update Report Request"
// @Success 200 {object} model.Report
// @Failure 400 {object} map[string]string
// @Router /api/v1/reports [put]
func (h *ReportHandler) Update(w http.ResponseWriter, r *http.Request) {
	var req request_report.UpdateReportReq

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid body"})
		return
	}

	if err := request_report.Validate(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	rep, err := h.service.Update(r.Context(), req.ID, req.Template)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}
	enc := json.NewEncoder(w)
	enc.SetEscapeHTML(false)
	enc.Encode(rep)
}

// TurnOnOff godoc
// @Summary Turn report on or off
// @Description Activate or deactivate a report
// @Tags reports
// @Accept json
// @Produce json
// @Param request body request_report.TurnOnOffReq true "Turn On/Off Request"
// @Success 204
// @Failure 400 {object} map[string]string
// @Router /api/v1/reports/turnonoff [post]
func (h *ReportHandler) TurnOnOff(w http.ResponseWriter, r *http.Request) {
	var req request_report.TurnOnOffReq

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid body"})
		return
	}

	if err := request_report.Validate(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	if req.ID == 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "id is required"})
		return
	}
	if err := h.service.TurnOnOff(r.Context(), req.ID, req.Active); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// GenerateReportFromFile godoc
// @Summary Generate report from file
// @Description Generate a report by uploading a file
// @Tags reports
// @Accept multipart/form-data
// @Produce html
// @Param idReport formData int true "Report ID"
// @Param prompt formData string false "Prompt"
// @Param model formData string false "Model"
// @Param file formData file true "File to upload"
// @Success 200 {string} string "HTML report"
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /api/v1/reports/generate [post]
func (h *ReportHandler) GenerateReportFromFile(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(maxUploadSize)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": fmt.Sprintf("Could not parse multipart form: %v", err)})
		return
	}
	idReport, err := strconv.Atoi(r.FormValue("idReport"))
	if err != nil || idReport <= 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid idReport"})
		return
	}
	promptUser := r.FormValue("prompt")
	llm := r.FormValue("llm")
	model := r.FormValue("model")
	file, fileHeader, err := r.FormFile("file")
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": fmt.Sprintf("Could not get file from form: %v", err)})
		return
	}
	if fileHeader.Size > maxUploadSize {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": fmt.Sprintf("File is too large: %d > %d", fileHeader.Size, maxUploadSize)})
		return
	}
	defer file.Close()
	file.Seek(0, 0)
	fmt.Printf("Received file: %s with size: %d bytes\n", fileHeader.Filename, fileHeader.Size)
	rep, err := h.service.GenerateReportFromFile(r.Context(), idReport, promptUser, llm, model, file, fileHeader.Filename, fileHeader.Header.Get("Content-Type"))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": fmt.Sprintf("Could not generate report: %v", err)})
		return
	}
	w.Header().Set("Content-Type", "text/html")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(rep))
}
