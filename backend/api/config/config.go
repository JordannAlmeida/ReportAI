package config

import (
	"os"
)

type Config struct {
	Port               string
	DbURL              string
	GeminiAPIKey       string
	GeminiModelDefault string
}

func Load() *Config {
	return &Config{
		Port:               getEnv("PORT", "8080"),
		DbURL:              getEnv("DB_URL", ""),
		GeminiAPIKey:       getEnv("GEMINI_API_KEY", ""),
		GeminiModelDefault: getEnv("GEMINI_MODEL_DEFAULT", ""),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
