import { useCallback, useMemo, useState } from "react";
import { useCodeRunner } from "../../hooks/useCodeRunner";
import { Button } from "./Button";
import { useLLMEngine } from "../../hooks/useLLMEngine";

const PRIMES_CODE = `import time

def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

count = 0
num = 2

while count < 10:
    if is_prime(num):
        print(num)
        time.sleep(0.1)
        count += 1
    num += 1`;

// to install packages micropip is necessary
const NUMPY_CODE = `import micropip
await micropip.install("numpy")

import numpy as np

a = np.array([1, 2, 3, 4, 5])
b = a ** 2

for x, y in zip(a, b):
    print(f"{x} squared is {y}")`;

export const CodeSection = () => {
  const [code, setCode] = useState<string | undefined>(undefined);
  const { runPython, result, loading, error } = useCodeRunner();

  const [prompt, setPrompt] = useState<string>("");
  const [llmResponse, setLlmResponse] = useState<string>("");
  const [llmLoading, setLlmLoading] = useState(false);

  const onRunClick = useCallback(() => {
    if (code) {
      runPython(code);
    }
  }, [code, runPython]);

  const outputString = useMemo(() => {
    if (error) return error;
    if (loading) return "Loading...";
    return result ?? "Result will appear here...";
  }, [error, loading, result]);

  const {
    isLoading: llmInitLoading,
    loadingProgress,
    error: llmError,
    isReady: llmReady,
    generateResponse,
    initializeEngine,
  } = useLLMEngine("Llama-3.2-1B-Instruct-q4f16_1-MLC");

  const onGenerateFromPrompt = useCallback(async () => {
    if (!prompt.trim() || !llmReady) return;

    setLlmLoading(true);
    setLlmResponse("");

    try {
      const fullPrompt = `Generate Python code for the following request: "${prompt.trim()}". 
            
Please provide clean, executable Python code with comments. Include any necessary imports. 
If the request involves data processing, use basic Python libraries.
Format your response with the code in a code block, provide only the code as your response.`;

      const response = await generateResponse(fullPrompt);
      setLlmResponse(response);

      const codeMatch =
        response.match(/```python\n([\s\S]*?)\n```/) ||
        response.match(/```\n([\s\S]*?)\n```/);

      if (codeMatch) {
        setCode(codeMatch[1].trim());
      } else {
        const lines = response.split("\n");
        const codeLines = lines.filter(
          (line) =>
            !line.toLowerCase().includes("here") &&
            !line.toLowerCase().includes("this code") &&
            line.trim() !== "",
        );
        if (codeLines.length > 0) {
          setCode(codeLines.join("\n"));
        }
      }
    } catch (err) {
      setLlmResponse(
        `Error: ${err instanceof Error ? err.message : "Failed to generate code"}`,
      );
    } finally {
      setLlmLoading(false);
    }
  }, [prompt, llmReady, generateResponse]);

  const llmStatusText = useMemo(() => {
    if (llmInitLoading) return `Loading LLM... ${loadingProgress}%`;
    if (llmError) return `LLM Error: ${llmError}`;
    if (llmLoading) return "Generating code...";
    if (llmResponse) return llmResponse;
    if (llmReady) return "LLM ready - enter a prompt above to generate code";
    return "Click 'Initialize LLM' to start";
  }, [
    llmInitLoading,
    loadingProgress,
    llmError,
    llmLoading,
    llmResponse,
    llmReady,
  ]);

  return (
    <div className="w-full max-w-2xl bg-gray-800 text-white rounded-xl shadow-xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-pink-500">Python Runner</h2>
        <div className="flex gap-3">
          <Button
            onPress={() => setCode(PRIMES_CODE)}
            text="Primes"
            disabled={loading}
            type="secondary"
          />
          <Button
            onPress={() => setCode(NUMPY_CODE)}
            text="Numpy"
            disabled={loading}
            type="secondary"
          />
          <Button
            onPress={onRunClick}
            text="Run"
            disabled={loading}
            type="primary"
          />
        </div>
      </div>

      <div className="space-y-3">
        {!llmReady && (
          <Button
            onPress={initializeEngine}
            text="Initialize LLM"
            disabled={llmInitLoading}
            type="primary"
          />
        )}

        {llmReady && (
          <div className="space-y-3">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-blue-400 mb-2">
                  Code Generation Prompt
                </label>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., 'Create a function to sort a list of numbers'"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !llmLoading) {
                      onGenerateFromPrompt();
                    }
                  }}
                />
              </div>
              <Button
                onPress={onGenerateFromPrompt}
                text="Generate"
                disabled={!prompt.trim() || llmLoading}
                type="primary"
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-blue-400">Code Editor</h3>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Type some Python code or generate it using the prompt above..."
            rows={12}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-sm font-mono focus:ring-2 focus:ring-pink-500"
          />
          <div className="bg-black border border-pink-500 rounded-lg p-4 text-sm font-mono whitespace-pre-wrap h-[120px] overflow-y-auto">
            <div className="text-pink-400 mb-2">Python Output:</div>
            {outputString}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-green-400">LLM response</h3>
          <div className="bg-gray-700 border border-green-500 rounded-lg p-4 text-sm whitespace-pre-wrap h-[400px] overflow-y-auto">
            <div className="text-green-400 mb-2">
              {llmInitLoading && `Loading Progress: ${loadingProgress}%`}
              {llmReady && "LLM response:"}
              {!llmReady && !llmInitLoading && "LLM not loaded:"}
            </div>
            {llmStatusText}
          </div>
        </div>
      </div>
    </div>
  );
};
