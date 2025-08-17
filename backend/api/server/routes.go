package server

import (
	"database/sql"
	"reportia/handler"
	"reportia/integration/google"
	"reportia/repository"
	"reportia/service"

	_ "reportia/docs"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	httpSwagger "github.com/swaggo/http-swagger"
)

func (s *Server) RegisterRoutes() {
	s.router.PathPrefix("/swagger/").Handler(httpSwagger.WrapHandler)
	s.registerHealthRoutes()

	db, err := sql.Open("postgres", s.cfg.DbURL)
	if err != nil {
		panic(err)
	}

	api := s.router.PathPrefix("/api/v1").Subrouter()
	s.registerReportRoutes(api, db)
}

func (s *Server) registerHealthRoutes() {
	s.router.HandleFunc("/health", handler.Health).Methods("GET")
}

func (s *Server) registerReportRoutes(r *mux.Router, db *sql.DB) {
	repo := repository.NewReportRepository(db)
	geminiApi := google.NewGeminiAPI(s.cfg.GeminiAPIKey, db, s.cfg.GeminiModelDefault)
	service := service.NewReportService(repo, geminiApi)
	h := handler.NewReportHandler(service)

	r.HandleFunc("/reports", h.List).Methods("GET")
	r.HandleFunc("/reports/filter", h.Filter).Methods("GET")
	r.HandleFunc("/reports", h.Create).Methods("POST")
	r.HandleFunc("/reports", h.Update).Methods("PUT")
	r.HandleFunc("/reports/turnonoff", h.TurnOnOff).Methods("POST")
	r.HandleFunc("/reports/generate", h.GenerateReportFromFile).Methods("POST")
}
