package middleware

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
)

const maxLogBodySize = 500

func truncateString(s string, max int) string {
	if len(s) > max {
		return s[:max] + "...(truncated)"
	}
	return s
}

type responseRecorder struct {
	http.ResponseWriter
	statusCode int
	body       *bytes.Buffer
}

func newResponseRecorder(w http.ResponseWriter) *responseRecorder {
	return &responseRecorder{
		ResponseWriter: w,
		statusCode:     http.StatusOK,
		body:           &bytes.Buffer{},
	}
}

func (rr *responseRecorder) WriteHeader(code int) {
	rr.statusCode = code
	rr.ResponseWriter.WriteHeader(code)
}

func (rr *responseRecorder) Write(b []byte) (int, error) {
	rr.body.Write(b)
	return rr.ResponseWriter.Write(b)
}

func Logging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		var reqBody bytes.Buffer
		if r.Body != nil {
			bodyBytes, _ := io.ReadAll(r.Body)
			reqBody.Write(bodyBytes)

			r.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
		}

		fmt.Println("=== Incoming Request ===")
		fmt.Printf("Method: %s\n", r.Method)
		fmt.Printf("URL: %s\n", r.URL.String())
		fmt.Println("Headers:", r.Header)
		fmt.Println("Body:", truncateString(reqBody.String(), maxLogBodySize))

		rec := newResponseRecorder(w)

		next.ServeHTTP(rec, r)

		fmt.Println("=== Outgoing Response ===")
		fmt.Printf("Status: %d\n", rec.statusCode)
		fmt.Println("Body:", truncateString(rec.body.String(), maxLogBodySize))
	})
}
