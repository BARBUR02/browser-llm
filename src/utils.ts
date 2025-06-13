export function extractCodeFromLLMResponse(response: string): string {
  const codeMatch =
    response.match(/```python\n([\s\S]*?)\n```/) ||
    response.match(/```\n([\s\S]*?)\n```/);

  if (codeMatch) {
    return codeMatch[1].trim();
  }

  const lines = response.split("\n");

  const codeLines = lines.filter(
    (line) =>
      !line.toLowerCase().includes("here") &&
      !line.toLowerCase().includes("this code") &&
      line.trim() !== "",
  );

  return codeLines.join("\n");
}

export const getFullPrompt = (prompt: string) => {
  const fullPrompt = `Generate Python code for the following request: "${prompt.trim()}".    
  Please provide clean, executable Python code with comments. Include any necessary imports. 
  If the request involves data processing, use basic Python libraries.
  Format your response with the code in a code block, provide only the code as your response.`;

  return fullPrompt;
};
