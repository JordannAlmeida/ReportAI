package server

import (
	"fmt"
	"log"
	"net/http"
	"reportia/config"
	"reportia/middleware"

	"github.com/gorilla/mux"
)

type Server struct {
	cfg    *config.Config
	router *mux.Router
}

func New(cfg *config.Config) *Server {
	s := &Server{
		cfg:    cfg,
		router: mux.NewRouter(),
	}
	s.RegisterRoutes()
	return s
}

func (s *Server) Start() error {
	addr := fmt.Sprintf(":%s", s.cfg.Port)
	log.Printf("Server running on %s", addr)
	return http.ListenAndServe(addr, middleware.CORS(s.cfg.AllowedOrigin)(s.router))
}
