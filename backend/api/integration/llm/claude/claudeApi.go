package claude

import (
	"context"
	"fmt"
	"io"
	"path/filepath"
	"strings"

	"github.com/anthropics/anthropic-sdk-go"
	"github.com/anthropics/anthropic-sdk-go/option"
)

type AnthropicAPI struct {
	apiKey string
	model  string
}

func NewAnthropicAPI(apiKey string, model string) *AnthropicAPI {
	return &AnthropicAPI{apiKey: apiKey, model: model}
}

func (ant *AnthropicAPI) GenerateAnalisysFromReportFile(ctx context.Context, prompt string, model string, file io.Reader, fileName string, fileType string) (string, error) {
	client := ant.initializeAnthropicClient()

	fileBytes, err := io.ReadAll(file)
	if err != nil {
		return "", err
	}

	fileBaseName := strings.TrimSuffix(fileName, filepath.Ext(fileName))
	fileContent := string(fileBytes)

	var modelUsed string
	if model == "" {
		modelUsed = ant.model
	} else {
		modelUsed = model
	}

	message, err := client.Messages.New(ctx, anthropic.MessageNewParams{
		Model:     anthropic.Model(modelUsed),
		MaxTokens: int64(4096),
		Messages: []anthropic.MessageParam{
			anthropic.NewUserMessage(anthropic.NewTextBlock(fmt.Sprintf("%s\n\n---\nFile name: %s\nFile content:\n%s", prompt, fileBaseName, fileContent))),
		},
	})

	if err != nil {
		return "", err
	}

	if len(message.Content) > 0 {
		return message.Content[0].Text, nil
	}

	return "", nil
}

func (ant *AnthropicAPI) initializeAnthropicClient() anthropic.Client {
	return anthropic.NewClient(option.WithAPIKey(ant.apiKey))
}
