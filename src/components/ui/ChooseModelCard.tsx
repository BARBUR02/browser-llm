import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

  return (
    <div className="w-full max-w-md space-y-6 p-0">
      <div className="w-full bg-gray-800 rounded-xl shadow-2xl space-y-6 p-0">
        <div className="space-y-2">
          {!isInitLoading && (
            <Select value={selectedModelId} onValueChange={changeSelectedModel}>
              <SelectTrigger
                id="model-select"
                className="w-full bg-gray-700 border-gray-600 text-white focus:ring-pink-500 focus:border-pink-500"
              >
                <SelectValue placeholder="Select a model to get started" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                {AVAILABLE_MODELS.map((model) => (
                  <TooltipProvider key={model.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SelectItem
                          value={model.id}
                          className="hover:bg-gray-600 focus:bg-pink-600 w-full"
                        >
                          {model.name}
                        </SelectItem>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="bg-gray-900 border-gray-700 text-white"
                      >
                        <div className="p-2 space-y-1">
                          <p className="font-bold">{model.name}</p>
                          <p className="text-sm">{model.description}</p>
                          <p className="text-sm">Size: {model.sizeGB}GB</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <InitModelLoading
          isLoading={isInitLoading}
          progress={loadingProgress}
        />

        {initError && <div>{initError}</div>}
      </div>
    </div>
  );
};
