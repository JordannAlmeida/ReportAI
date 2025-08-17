package helper

import (
	"regexp"
)

func RemoveAllSpacesAndBreakingLines(input string) string {
	re := regexp.MustCompile(`\s+`)
	result := re.ReplaceAllString(input, "")
	return result
}

func RemoveSpecialBlockingLLMCharacters(input string) string {
	re := regexp.MustCompile("```.*")
	result := re.ReplaceAllString(input, "")
	re = regexp.MustCompile("(?s)")
	return re.ReplaceAllString(result, "")
}
