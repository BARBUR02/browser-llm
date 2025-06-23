export function extractCodeFromLLMResponse(response: string): string {
  const codeMatch =
    response.match(/```python\n([\s\S]*?)\n```/) ||
    response.match(/```\n([\s\S]*?)\n```/);

  let code = "";

  if (codeMatch) {
    code = codeMatch[1].trim();
  } else {
    const lines = response.split("\n");
    const codeLines = lines.filter(
      (line) =>
        !line.toLowerCase().includes("here") &&
        !line.toLowerCase().includes("this code") &&
        line.trim() !== "",
    );
    code = codeLines.join("\n");
  }

  const installBlock = generateMicropipInstallBlock(code);
  return installBlock + "\n\n" + code;
}

const standardLibs = new Set([
  "sys",
  "os",
  "math",
  "re",
  "json",
  "datetime",
  "time",
  "random",
  "statistics",
  "itertools",
  "functools",
  "collections",
  "typing",
  "pathlib",
  "string",
  "copy",
  "threading",
  "subprocess",
  "shutil",
]);

function generateMicropipInstallBlock(code: string): string {
  const importRegex = /^\s*(?:import|from)\s+([\w\d_\.]+)/gm;
  const packages = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = importRegex.exec(code))) {
    const lib = match[1].split(".")[0];
    if (!standardLibs.has(lib)) {
      packages.add(lib);
    }
  }

  if (packages.size === 0) {
    return "";
  }

  const installLines = [`import micropip`, `await micropip.install([`];
  installLines.push(...[...packages].map((lib) => `  "${lib}",`));
  installLines.push(`])`);

  return installLines.join("\n");
}

export const getFullPrompt = (prompt: string) => {
  const fullPrompt = `Generate Python code for the following request: "${prompt.trim()}".    
Please provide clean, executable Python code with comments. Include any necessary imports. 
If the request involves data processing, use basic Python libraries.
Format your response with the code in a code block, provide only the code as your response.`;

  return fullPrompt;
};
