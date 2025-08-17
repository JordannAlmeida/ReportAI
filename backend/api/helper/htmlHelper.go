package helper

import (
	"bytes"
	"strings"

	"golang.org/x/net/html"
)

func FormatHTML(htmlContent string) (string, error) {
	doc, err := html.Parse(strings.NewReader(htmlContent))
	if err != nil {
		return "", err
	}
	var buf bytes.Buffer

	err = html.Render(&buf, doc)
	if err != nil {
		return "", err
	}

	return buf.String(), nil
}
