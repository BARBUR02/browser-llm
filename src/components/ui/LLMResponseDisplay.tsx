import { useMemo } from "react";

interface LLMResponseDisplayProps {
  llmResponse: string;
  llmLoading: boolean;
  llmReady: boolean;
}

export const LLMResponseDisplay = ({
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
