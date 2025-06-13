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
  initError: string | undefined;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export const ModelProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedModelId, setSelectedModelId] = useState<string | undefined>(
    undefined
  );

  const changeSelectedModel = (id: string) => {
    setSelectedModelId(id);
    initialize(id);
  };

  const {
    isInitLoading,
    initProgress,
    initError,
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
        readyToUse,
        initError,
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
