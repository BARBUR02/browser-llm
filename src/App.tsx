import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { CodeSection } from "./components/ui/CodeSection";
import { Button } from "./components/ui/Button";
import { useLLMEngine } from "./hooks/useLLMEngine";
import { ModeSelector } from "./components/ui/ModeSelector";

// list of available models: https://github.com/mlc-ai/web-llm/blob/d8b25fed8e81d6f6b27cdc07e839c1c09cfaa43d/src/config.ts#L330
const AVAILABLE_MODELS = [
  {
    id: "Llama-3.2-1B-Instruct-q4f32_1-MLC",
    name: "Llama 3.2 1B  - Small - Q4 / FP32 - 1.1GB",
    sizeGB: 1.1,
  },
  {
    id: "Llama-3.2-1B-Instruct-q0f16-MLC",
    name: "Llama 3.2 1B  - Medium - Full / FP16 - 2.5GB",
    sizeGB: 2.5,
  },
  {
    id: "Llama-3.2-1B-Instruct-q0f32-MLC",
    name: "Llama 3.2 1B  - Large - Full / FP32 - 5.1GB",
    sizeGB: 5.1,
  },
  {
    id: "Mistral-7B-Instruct-v0.3-q4f16_1-MLC",
    name: "Mistral 7B - Medium - Q4 / FP16 - 4GB",
    sizeGB: 5.5,
  },
];

interface LLMCodeGeneratorProps {
  onCodeGenerated: (code: string) => void;
  onLlmStateChange: (
    response: string,
    loading: boolean,
    ready: boolean,
  ) => void;
  selectedModelId: string | undefined;
  selectedMode: string;
  onModeChange: (mode: string) => void;
  context: AgentContext;
  buildPromptFromContext: (context: AgentContext) => string;
  codeError?: string;
  onPrompt: (prompt: string) => void;
}

const LLMCodeGenerator = ({
  onCodeGenerated,
  onLlmStateChange,
  selectedModelId,
  selectedMode,
  onModeChange,
  context,
  buildPromptFromContext,
  codeError,
  onPrompt,
}: LLMCodeGeneratorProps) => {
  const [prompt, setPrompt] = useState<string>("");

  const {
    isLoading: llmInitLoading,
    loadingProgress,
    error: llmError,
    isReady: llmReady,
    generateResponse,
    initializeEngine,
  } = useLLMEngine(selectedModelId);

  useEffect(() => {
    onLlmStateChange("", false, llmReady);
  }, [llmReady, onLlmStateChange]);

  const handleAskMode = useCallback(async () => {
    if (!prompt.trim() || !llmReady) return;

    onLlmStateChange("", true, llmReady);

    try {
      const fullPrompt = `Generate Python code for the following request: "${prompt.trim()}". 
            
Please provide clean, executable Python code with comments. Include any necessary imports. 
If the request involves data processing, use basic Python libraries.
Format your response with the code in a code block, provide only the code as your response.`;

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
            line.trim() !== "",
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

  const handleAgentMode = useCallback(async () => {
    if (!prompt.trim() || !llmReady) return;

    onLlmStateChange("", true, llmReady);

    try {
      const fullPrompt = `Generate Python code for the following request: "${prompt.trim()}". 
            
Please provide clean, executable Python code with comments. Include any necessary imports. 
If the request involves data processing, use basic Python libraries.
Format your response with the code in a code block, provide only the code as your response.`;

      const response = await generateResponse(fullPrompt);
      onLlmStateChange(response, false, llmReady);

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
        if (codeLines.length > 0) {
          code = codeLines.join("\n");
        }
      }
      if (code) {
        onCodeGenerated(code);
      }
    } catch (err) {
      const errorMsg = `Error: ${err instanceof Error ? err.message : "Failed to generate code"}`;
      onLlmStateChange(errorMsg, false, llmReady);
    }
  }, [prompt, llmReady, generateResponse, onCodeGenerated, onLlmStateChange]);

  const onGenerateFromPrompt = useCallback(async () => {
    if (!prompt.trim() || !llmReady) return;
    onPrompt(prompt.trim());

    if (selectedMode === "ask") {
      await handleAskMode();
    } else if (selectedMode === "agent") {
      await handleAgentMode();
    }
  }, [prompt, llmReady, onPrompt, selectedMode, handleAskMode, handleAgentMode]);

  return (
    <div className="w-full bg-gray-800 text-white rounded-xl shadow-xl p-6 space-y-4">
      <h2 className="text-2xl font-bold text-green-500">AI Code Generator</h2>
      {/* Mode selector */}
      <ModeSelector value={selectedMode} onChange={onModeChange} />

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

interface LLMResponseDisplayProps {
  llmResponse: string;
  llmLoading: boolean;
  llmReady: boolean;
}

const LLMResponseDisplay = ({
  llmResponse,
  llmLoading,
  llmReady,
}: LLMResponseDisplayProps) => {
  const displayText = useMemo(() => {
    if (llmLoading) return "Generating code...";
    if (llmResponse) return llmResponse;
    if (llmReady) return "LLM ready - enter a prompt above to generate code";
    return "Select a model and initialize LLM to start generating code";
  }, [llmLoading, llmResponse, llmReady]);

  return (
    <div className="w-full bg-gray-800 text-white rounded-xl shadow-xl p-6 space-y-4">
      <h2 className="text-2xl font-bold text-green-500">LLM Response</h2>
      <div className="bg-gray-700 border border-green-500 rounded-lg p-4 text-sm whitespace-pre-wrap h-[300px] overflow-y-auto">
        <div className="text-green-400 mb-2">Response:</div>
        {displayText}
      </div>
    </div>
  );
};

type AgentContext = {
  task: string;
  history: { code: string; error?: string }[];
};

function buildPromptFromContext(
  context: AgentContext,
  maxHistoryAttempts: number = 3
) {
  let prompt = `Task: ${context.task}\n`;

  const attempts = context.history.length;
  const lastEntry = context.history[context.history.length - 1];

  if (lastEntry) {
    prompt += `\nCurrent code:\n${lastEntry.code}\n`;
    prompt += `Error: ${lastEntry.error ?? "None"}\n`;
  }

  if (attempts > 1) {
    const historyToShow = context.history.slice(
      Math.max(0, attempts - maxHistoryAttempts - 1),
      attempts - 1
    );
    if (historyToShow.length > 0) {
      prompt += `\nRecent previous attempts:\n`;
      historyToShow.forEach((h, i) => {
        prompt += `Attempt ${attempts - historyToShow.length + i}:\nCode:\n${h.code}\nError:\n${h.error ?? "None"}\n`;
      });
    }
  }

  if (attempts > maxHistoryAttempts) {
    prompt += `\nNote: Previous ${attempts} attempts failed.\n`;
  }

  return prompt;
}

function App() {
  const [selectedModelId, setSelectedModelId] = useState<string | undefined>(
    undefined,
  );

  const [llmResponse, setLlmResponse] = useState<string>("");
  const [llmLoading, setLlmLoading] = useState(false);
  const [llmReady, setLlmReady] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [selectedMode, setSelectedMode] = useState<string>("ask");
  const [context, setContext] = useState<AgentContext>({ task: "", history: [] });
  const [codeError, setCodeError] = useState<string | undefined>(undefined);

  const handleLlmStateChange = useCallback(
    (response: string, loading: boolean, ready: boolean) => {
      setLlmResponse(response);
      setLlmLoading(loading);
      setLlmReady(ready);
    },
    [],
  );

  const handleCodeGenerated = useCallback((code: string) => {
    setGeneratedCode(code);
    setContext((ctx) => ({
      ...ctx,
      history: [...ctx.history, { code, error: codeError }],
    }));
  }, [codeError]);

  const handlePrompt = useCallback(
    (prompt: string) => {
      setContext({ task: prompt, history: [] });
    },
    []
  );

  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId);
    setLlmResponse("");
    setLlmLoading(false);
    setLlmReady(false);
    setGeneratedCode("");
  };

  const selectedModelDetails = AVAILABLE_MODELS.find(
    (m) => m.id === selectedModelId,
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 space-y-8">
      <header className="text-center">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Browser LLM
        </h1>
        <p className="text-gray-400 mt-2">
          Run Large Language Models directly in your browser with WASM.
        </p>
      </header>

      <div className="w-full max-w-6xl space-y-6">
        <div className="w-full p-6 bg-gray-800 rounded-xl shadow-2xl space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="model-select"
              className="block text-sm font-medium text-gray-300"
            >
              Choose a Model:
            </label>
            <Select value={selectedModelId} onValueChange={handleModelSelect}>
              <SelectTrigger
                id="model-select"
                className="w-full bg-gray-700 border-gray-600 text-white focus:ring-pink-500 focus:border-pink-500"
              >
                <SelectValue placeholder="Select a model to get started" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                {AVAILABLE_MODELS.map((model) => (
                  <SelectItem
                    key={model.id}
                    value={model.id}
                    className="hover:bg-gray-600 focus:bg-pink-600"
                  >
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedModelDetails && (
            <div className="text-center">
              <p className="text-lg font-semibold text-pink-400">
                Selected: {selectedModelDetails.name}
              </p>
              <p className="text-sm text-gray-400">
                Size: {selectedModelDetails.sizeGB}GB
              </p>
            </div>
          )}
        </div>

        <div className="w-full">
          <LLMCodeGenerator
            onCodeGenerated={handleCodeGenerated}
            onLlmStateChange={handleLlmStateChange}
            selectedModelId={selectedModelId}
            selectedMode={selectedMode}
            onModeChange={setSelectedMode}
            context={context}
            buildPromptFromContext={buildPromptFromContext}
            codeError={codeError}
            onPrompt={handlePrompt}
          />
        </div>
        <div className="w-full">
          <CodeSection
            generatedCode={generatedCode}
            autoRun={selectedMode === "agent"}
            onError={setCodeError}
          />
        </div>

        <div className="w-full">
          <LLMResponseDisplay
            llmResponse={llmResponse}
            llmLoading={llmLoading}
            llmReady={llmReady}
          />
        </div>
      </div>

      <footer className="text-center text-gray-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()} Browser LLM Project. Powered by
          WebAssembly.
        </p>
      </footer>
    </div>
  );
}

export default App;
