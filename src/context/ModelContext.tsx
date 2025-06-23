import { useLLMEngine } from "@/hooks/useLLMEngine";
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface ModelContextType {
  selectedModelId: string | undefined;
  changeSelectedModel: (id: string) => void;
  generateResponse: (fullPrompt: string) => Promise<string>;
  initProgress: number;
  isInitLoading: boolean;
  readyToUse: boolean;
  isInitRun: boolean;
  initError: string | undefined;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export const ModelProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedModelId, setSelectedModelId] = useState<string | undefined>(
    undefined,
  );

  const changeSelectedModel = (id: string) => {
    console.log("model change");
    setSelectedModelId(id);
    initialize(id);
  };

  const {
    isInitLoading,
    initProgress,
    initError,
    isInitRun,
    generateResponse,
    initialize,
    readyToUse,
  } = useLLMEngine();

  return (
    <ModelContext.Provider
      value={{
        selectedModelId,
        changeSelectedModel,
        generateResponse,
        initProgress,
        isInitLoading,
        initError,
        isInitRun,
        readyToUse,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};

export const useModelContext = (): ModelContextType => {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error("useModelContext must be used within a ModelProvider");
  }
  return context;
};
