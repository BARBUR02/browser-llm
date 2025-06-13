import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface ModelContextType {
  selectedModelId: string | undefined;
  changeSelectedModel: (id: string) => void;
  llmResponse: string;
  llmLoading: boolean;
  llmReady: boolean;
  generatedCode: string;
  handleCodeGenerated: (code: string) => void;
  handleLlmStateChange: (
    response: string,
    loading: boolean,
    ready: boolean
  ) => void;
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
    setLlmResponse("");
    setLlmLoading(false);
    setLlmReady(false);
    setGeneratedCode("");
  };

  const [llmResponse, setLlmResponse] = useState<string>("");
  const [llmLoading, setLlmLoading] = useState(false);
  const [llmReady, setLlmReady] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>("");

  const handleLlmStateChange = useCallback(
    (response: string, loading: boolean, ready: boolean) => {
      setLlmResponse(response);
      setLlmLoading(loading);
      setLlmReady(ready);
    },
    []
  );

  const handleCodeGenerated = useCallback((code: string) => {
    setGeneratedCode(code);
  }, []);

  return (
    <ModelContext.Provider
      value={{
        selectedModelId,
        changeSelectedModel,
        llmResponse,
        llmLoading,
        llmReady,
        generatedCode,
        handleCodeGenerated,
        handleLlmStateChange,
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
