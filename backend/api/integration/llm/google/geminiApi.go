package google

import (
	"io"
	"time"

	"golang.org/x/net/context"
	"google.golang.org/genai"
)

type GeminiAPI struct {
	apiKey string
	model  string
}

func NewGeminiAPI(apiKey string, model string) *GeminiAPI {
	return &GeminiAPI{apiKey: apiKey, model: model}
}

func (gemini *GeminiAPI) GenerateAnalisysFromReportFile(ctx context.Context, prompt string, model string, file io.Reader, fileName string, fileType string) (string, error) {
	clientGemini, err := gemini.initializeGeminiClient(ctx)
	if err != nil {
		return "", err
	}
	fileNameWithoutExtension := fileName[:len(fileName)-len(".txt")]
	genaiFile, err := clientGemini.Files.Upload(ctx, file, &genai.UploadFileConfig{
		Name:     fileNameWithoutExtension,
		MIMEType: fileType,
	})
	if err != nil {
		return "", err
	}
	maxTriesToUploadFile := 0
	for genaiFile.Source != genai.FileSourceUploaded && maxTriesToUploadFile < 10 {
		time.Sleep(1 * time.Second)
		maxTriesToUploadFile++
		genaiFile, err = clientGemini.Files.Get(ctx, genaiFile.Name, &genai.GetFileConfig{
			HTTPOptions: &genai.HTTPOptions{
				Timeout: func() *time.Duration { d := 10 * time.Second; return &d }(),
			},
		})
		if err != nil {
			return "", err
		}
	}

	defer clientGemini.Files.Delete(ctx, genaiFile.Name, &genai.DeleteFileConfig{
		HTTPOptions: &genai.HTTPOptions{
			Timeout: func() *time.Duration { d := 10 * time.Second; return &d }(),
		},
	})

	var modelUsedInGemini string
	if model == "" {
		modelUsedInGemini = gemini.model
	} else {
		modelUsedInGemini = model
	}
	chat, err := clientGemini.Chats.Create(ctx, modelUsedInGemini, &genai.GenerateContentConfig{}, make([]*genai.Content, 0))

	if err != nil {
		return "", err
	}

	parts := make([]*genai.Part, 0)

	parts = append(parts, genai.NewPartFromFile(*genaiFile))
	parts = append(parts, &genai.Part{
		Text: prompt,
	})

	contents_user := make([]*genai.Content, 0)
	contents_user = append(contents_user, &genai.Content{
		Parts: parts,
		Role:  genai.RoleUser,
	})

	geminiContentResponse, err := chat.GenerateContent(ctx, gemini.model, contents_user, &genai.GenerateContentConfig{})

	if err != nil {
		return "", err
	}

	return geminiContentResponse.Text(), nil
}

func (gemini *GeminiAPI) initializeGeminiClient(ctx context.Context) (*genai.Client, error) {
	context, cancel := context.WithDeadline(ctx, time.Now().Add(60*time.Second))
	defer cancel()

	client, err := genai.NewClient(context, &genai.ClientConfig{
		APIKey:  gemini.apiKey,
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		return nil, err
	}
	return client, nil
}
