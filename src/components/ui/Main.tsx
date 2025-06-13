import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CodeSection } from "./CodeSection";
import { AVAILABLE_MODELS } from "../../utils/consts";
import { useModelContext } from "@/context/ModelContext";
import { LandingCard } from "./LandingCard";
import { Chat } from "./Chat/Chat";
import { LLMCodeGenerator } from "./LLMCodeGenerator";
import { LLMResponseDisplay } from "./LLMResponseDisplay";

export function Main() {
  const {
    selectedModelId,
    handleCodeGenerated,
    handleLlmStateChange,
    llmResponse,
    llmReady,
    llmLoading,
    changeSelectedModel,
    generatedCode,
  } = useModelContext();
  const selectedModelDetails = AVAILABLE_MODELS.find(
    (m) => m.id === selectedModelId
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 space-y-8">
      <LandingCard />

      <Chat />

      <div className="w-full max-w-6xl space-y-6">
        <div className="w-full p-6 bg-gray-800 rounded-xl shadow-2xl space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="model-select"
              className="block text-sm font-medium text-gray-300"
            >
              Choose a Model:
            </label>
            <Select value={selectedModelId} onValueChange={changeSelectedModel}>
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
          />
        </div>

        <div className="w-full">
          <CodeSection generatedCode={generatedCode} />
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
