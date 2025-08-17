package main

import (
	"fmt"
	"log"
	"os"
	"reportia/config"
	"reportia/server"

	"github.com/joho/godotenv"
)

// @title ReportIA API
// @version 1.0
// @description ReportIA is an API for managing, generating, and processing reports using AI. It provides endpoints to create, update, list, filter, activate/deactivate, and generate reports from uploaded files. The API is designed for integration with modern web applications and supports file uploads, JSON requests, and advanced filtering.
// @termsOfService https://github.com/yourorg/reportia/blob/main/TERMS.md

// @contact.name ReportIA API Support
// @contact.url https://github.com/yourorg/reportia/issues
// @contact.email support@yourcompany.com

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:8080
func main() {
	env := os.Getenv("ENVIRONMENT")

	fmt.Println("Environment:", env)

	var envFile string
	if env != "local" && env != "" {
		envFile = ".env"
	} else {
		envFile = ".env.local"
	}

	fmt.Println("Loading environment variables from:", envFile)

	if err := godotenv.Load(envFile); err != nil {
		log.Println("No .env file found, using environment variables")
	}
	cfg := config.Load()
	srv := server.New(cfg)
	if err := srv.Start(); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
