package config

import (
	"reportia/helper"
)

type Config struct {
	Port          string
	DbURL         string
	AllowedOrigin string
}

func Load() *Config {
	return &Config{
		Port:          helper.GetEnv("PORT", "8080"),
		DbURL:         helper.GetEnv("DB_URL", ""),
		AllowedOrigin: helper.GetEnv("CORS_ALLOWED_ORIGIN", "http://localhost:5173"),
	}
}
