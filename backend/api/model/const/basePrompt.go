package const_model

func GetPromptToGenerateAnalysisFromFile(template string, additionalInformation string) string {
	prompt := `
		You are an expert in analyzing reports. Your task is to analyze the content of the file provided and generate a comprehensive analysis based on the data it contains. The file is attached to this request. So you need to evaluate the informations carefully and provide insights about file. In your response, you need provide a html representation of the analysis. This html can include tables, bullet points, graphs, and other visual aids to enhance the understanding of the data.
		Your html needs to follow the next structure of template:
		` + template + `
		Remember, you don't need to include any additional information outside of the provided template. Just the <html> tags directly inside the destination block of dynamic body.
		You can add graphs using javascript libraries like Chart.js or D3.js, but ensure they are properly formatted within the HTML structure. Also, you can add script tag to do any necessary data manipulation or visualization.
		**Important**:
		- All text must be written in pt-br portuguese.
		- Don't use placeholder for graphs, create real graphs using data from the file and javascript code.
	`
	if additionalInformation != "" {
		prompt += "\n\n**Additional information:**\n" + additionalInformation
	}
	return prompt
}
