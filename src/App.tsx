import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import Chat from "./components/ui/CodeSection";

const AVAILABLE_MODELS = [
  { id: "model-phi-2", name: "Phi-2 (Small, ~2.1GB)" },
  { id: "model-llama2-7b", name: "Llama2 7B (Medium, ~1.1GB)" },
  { id: "model-mistral-7b", name: "Mistral 7B (Medium, ~0.8GB)" },
  { id: "model-gemma-2b", name: "Gemma 2B (Small, ~3.2GB)" },
];

const DOWNLOAD_SPEED_MBps = 40;
const MODEL_SIZES_GB: { [key: string]: number } = {
  "model-phi-2": 2.1,
  "model-llama2-7b": 1.1,
  "model-mistral-7b": 0.8,
  "model-gemma-2b": 3.2,
};

function App() {
  const [selectedModelId, setSelectedModelId] = useState<string | undefined>(
    undefined,
  );
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [estimatedTimeLeft, setEstimatedTimeLeft] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isDownloading && selectedModelId) {
      const modelSizeGB = MODEL_SIZES_GB[selectedModelId];
      if (!modelSizeGB) {
        setIsDownloading(false);
        return;
      }
      const modelSizeMB = modelSizeGB * 1024;
      const totalDownloadTimeSeconds = modelSizeMB / DOWNLOAD_SPEED_MBps;
      let elapsedSeconds = (downloadProgress / 100) * totalDownloadTimeSeconds;

      interval = setInterval(() => {
        elapsedSeconds += 0.1;
        const currentProgress = Math.min(
          (elapsedSeconds / totalDownloadTimeSeconds) * 100,
          100,
        );
        setDownloadProgress(currentProgress);
        setEstimatedTimeLeft(
          Math.max(0, Math.ceil(totalDownloadTimeSeconds - elapsedSeconds)),
        );

        if (currentProgress >= 100) {
          setIsDownloading(false);
          clearInterval(interval);
        }
      }, 100);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isDownloading, selectedModelId, downloadProgress]);

  const handleModelSelect = (modelId: string) => {
    if (isDownloading && modelId === selectedModelId) return;
    setSelectedModelId(modelId);
    setIsDownloading(true);
    setDownloadProgress(0);
    setEstimatedTimeLeft(0);
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

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl items-start justify-center">
        <main className="w-full md:w-1/2 p-6 bg-gray-800 rounded-xl shadow-2xl space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="model-select"
              className="block text-sm font-medium text-gray-300"
            >
              Choose a Model:
            </label>
            <Select
              value={selectedModelId}
              onValueChange={handleModelSelect}
              disabled={isDownloading}
            >
              <SelectTrigger
                id="model-select"
                className="w-full bg-gray-700 border-gray-600 text-white focus:ring-pink-500 focus:border-pink-500"
              >
                <SelectValue placeholder="Select a model to download" />
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

          {selectedModelId && (
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-lg font-semibold">
                  {isDownloading
                    ? `Downloading: ${selectedModelDetails?.name}`
                    : `${selectedModelDetails?.name} ready!`}
                </p>
              </div>

              {isDownloading && (
                <div className="space-y-2">
                  <Progress
                    value={downloadProgress}
                    className="w-full [&>div]:bg-pink-500 bg-gray-700"
                  />
                  <p className="text-xs text-gray-400 text-center">
                    {downloadProgress < 100
                      ? `Estimated time left: ${estimatedTimeLeft}s`
                      : "Download complete!"}
                  </p>
                </div>
              )}
              {!isDownloading && downloadProgress === 100 && (
                <p className="text-sm text-green-400 text-center">
                  Model successfully downloaded and ready to use.
                </p>
              )}
            </div>
          )}
        </main>

        <div className="w-full md:w-1/2">
          <Chat />
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
