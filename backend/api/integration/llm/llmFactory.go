package llm

import (
	"context"
	"errors"
	"io"
	"reportia/helper"
	"reportia/integration/llm/google"
	openaiapi "reportia/integration/llm/openai"
)

var ErrLLMNotConfigured = errors.New("LLM not configured")

type LLM interface {
	GenerateAnalisysFromReportFile(ctx context.Context, prompt string, model string, file io.Reader, fileName string, fileType string) (string, error)
}

func GenerateAnalisysFromReportFile(llm LLM, ctx context.Context, prompt string, model string, file io.Reader, fileName string, fileType string) (string, error) {
	if llm == nil {
		return "", ErrLLMNotConfigured
	}
	return llm.GenerateAnalisysFromReportFile(ctx, prompt, model, file, fileName, fileType)
}

func NewLLM(llm string) LLM {
	if llm == "" {
		return nil
	}
	switch llm {
	case "openai":
		apiKey := helper.GetEnv("OPENAI_API_KEY", "")
		model := helper.GetEnv("OPENAI_MODEL_DEFAULT", "")
		return openaiapi.NewOpenAIAPI(apiKey, model)
	default:
		apiKey := helper.GetEnv("GEMINI_API_KEY", "")
		model := helper.GetEnv("GEMINI_MODEL_DEFAULT", "")
		return google.NewGeminiAPI(apiKey, model)
	}
}
