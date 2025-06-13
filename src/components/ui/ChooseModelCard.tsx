import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AVAILABLE_MODELS } from "../../utils/consts";
import { useModelContext } from "@/context/ModelContext";
import { InitModelLoading } from "./InitModelLoading";

export const ChooseModelCard = () => {
  const {
    selectedModelId,
    changeSelectedModel,
    isInitLoading,
    initProgress: loadingProgress,
    initError,
  } = useModelContext();

  const selectedModelDetails = AVAILABLE_MODELS.find(
    (m) => m.id === selectedModelId,
  );

  return (
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

        <InitModelLoading
          isLoading={isInitLoading}
          progress={loadingProgress}
        />

        {initError && <div>{initError}</div>}
      </div>
    </div>
  );
};
