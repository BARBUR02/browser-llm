import { useLLMEngine } from "@/hooks/useLLMEngine";
import { getFullPrompt } from "@/utils";
import { Progress } from "@radix-ui/react-progress";
import { useState, useEffect, useCallback } from "react";
import { Button } from "./Button";

interface LLMCodeGeneratorProps {
  onCodeGenerated: (code: string) => void;
  onLlmStateChange: (
    response: string,
    loading: boolean,
    ready: boolean
  ) => void;
  selectedModelId: string | undefined;
}

export const LLMCodeGenerator = ({
  onCodeGenerated,
  onLlmStateChange,
  selectedModelId,
}: LLMCodeGeneratorProps) => {
  const [prompt, setPrompt] = useState<string>("");

  const {
    isLoading: llmInitLoading,
    loadingProgress,
    initializeError: llmError,
    isReady: llmReady,
    generateResponse,
    initializeEngine,
  } = useLLMEngine(selectedModelId);

  useEffect(() => {
    onLlmStateChange("", false, llmReady);
  }, [llmReady, onLlmStateChange]);

  const onGenerateFromPrompt = useCallback(async () => {
    if (!prompt.trim() || !llmReady) return;

    onLlmStateChange("", true, llmReady);

    try {
      const fullPrompt = getFullPrompt(prompt);
      const response = await generateResponse(fullPrompt);
      onLlmStateChange(response, false, llmReady);

      const codeMatch =
        response.match(/```python\n([\s\S]*?)\n```/) ||
        response.match(/```\n([\s\S]*?)\n```/);

      if (codeMatch) {
        onCodeGenerated(codeMatch[1].trim());
      } else {
        const lines = response.split("\n");
        const codeLines = lines.filter(
          (line) =>
            !line.toLowerCase().includes("here") &&
            !line.toLowerCase().includes("this code") &&
            line.trim() !== ""
        );
        if (codeLines.length > 0) {
          onCodeGenerated(codeLines.join("\n"));
        }
      }
    } catch (err) {
      const errorMsg = `Error: ${err instanceof Error ? err.message : "Failed to generate code"}`;
      onLlmStateChange(errorMsg, false, llmReady);
    }
  }, [prompt, llmReady, generateResponse, onCodeGenerated, onLlmStateChange]);

  return (
    <div className="w-full bg-gray-800 text-white rounded-xl shadow-xl p-6 space-y-4">
      <h2 className="text-2xl font-bold text-green-500">AI Code Generator</h2>

      <div className="space-y-3">
        {selectedModelId && !llmReady && (
          <Button
            onPress={initializeEngine}
            text="Initialize LLM"
            disabled={llmInitLoading}
            type="primary"
          />
        )}

        {llmInitLoading && (
          <div className="space-y-2">
            <div className="text-center text-green-400">
              Loading LLM... {loadingProgress}%
            </div>
            {loadingProgress > 0 && (
              <Progress
                value={loadingProgress}
                className="w-full [&>div]:bg-green-500 bg-gray-700"
              />
            )}
          </div>
        )}

        {!selectedModelId && (
          <div className="text-center text-gray-400">
            Please select a model above to get started
          </div>
        )}

        {llmReady && (
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-green-400 mb-2">
                Code Generation Prompt
              </label>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Create a function to sort a list of numbers'"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onGenerateFromPrompt();
                  }
                }}
              />
            </div>
            <Button
              onPress={onGenerateFromPrompt}
              text="Generate"
              disabled={!prompt.trim()}
              type="primary"
            />
          </div>
        )}

        {llmError && (
          <div className="text-red-400 text-sm">LLM Error: {llmError}</div>
        )}
      </div>
    </div>
  );
};
