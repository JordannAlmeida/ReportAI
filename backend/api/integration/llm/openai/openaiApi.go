package openaiapi

import (
	"context"
	"fmt"
	"io"
	"path/filepath"
	"strings"

	openai "github.com/sashabaranov/go-openai"
)

type OpenAIAPI struct {
	apiKey string
	model  string
}

func NewOpenAIAPI(apiKey string, model string) *OpenAIAPI {
	return &OpenAIAPI{apiKey: apiKey, model: model}
}

func (oai *OpenAIAPI) GenerateAnalisysFromReportFile(ctx context.Context, prompt string, model string, file io.Reader, fileName string, fileType string) (string, error) {
	client := oai.initializeOpenAIClient()

	fileBytes, err := io.ReadAll(file)
	if err != nil {
		return "", err
	}

	fileBaseName := strings.TrimSuffix(fileName, filepath.Ext(fileName))
	fileContent := string(fileBytes)

	var modelUsed string
	if model == "" {
		modelUsed = oai.model
	} else {
		modelUsed = model
	}
	req := openai.ChatCompletionRequest{
		Model: modelUsed,
		Messages: []openai.ChatCompletionMessage{
			{
				Role:    openai.ChatMessageRoleUser,
				Content: fmt.Sprintf("%s\n\n---\nFile name: %s\nFile content:\n%s", prompt, fileBaseName, fileContent),
			},
		},
	}

	resp, err := client.CreateChatCompletion(ctx, req)
	if err != nil {
		return "", err
	}

	if len(resp.Choices) > 0 {
		return resp.Choices[0].Message.Content, nil
	}

	return "", nil
}

func (oai *OpenAIAPI) initializeOpenAIClient() *openai.Client {
	return openai.NewClient(oai.apiKey)
}
