import { useState, useCallback, useRef, useEffect } from "react";
import { CreateMLCEngine, MLCEngine } from "@mlc-ai/web-llm";

interface UseLLMEngineReturn {
  engine: MLCEngine | null;
  isLoading: boolean;
  loadingProgress: number;
  initializeError: string | null;
  isReady: boolean;
  generateResponse: (prompt: string) => Promise<string>;
  initializeEngine: () => Promise<void>;
}

type ProgressEvent = {
  progress?: number;
};

export const useLLMEngine = (
  modelId: string = "Llama-3.2-1B-Instruct-q4f16_1-MLC"
): UseLLMEngineReturn => {
  const [engine, setEngine] = useState<MLCEngine | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [initializeError, setInitializeError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const engineRef = useRef<MLCEngine | null>(null);

  const initProgressCallback = useCallback((progress: ProgressEvent) => {
    console.log("Model loading progress:", progress);
    if (progress.progress !== undefined) {
      setLoadingProgress(Math.round(progress.progress * 100));
    }
  }, []);

  const initializeEngine = useCallback(async () => {
    if (engineRef.current) {
      return;
    }

    setIsLoading(true);
    setInitializeError(null);
    setLoadingProgress(0);

    try {
      console.log(`Attempting to initialize model: ${modelId}`);

      const newEngine = await CreateMLCEngine(modelId, {
        initProgressCallback,
      });

      engineRef.current = newEngine;
      setEngine(newEngine);
      setIsReady(true);
      setLoadingProgress(100);
      console.log("Engine initialized successfully");
    } catch (err) {
      console.error("Failed to initialize LLM engine:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to initialize engine";
      setInitializeError(
        `${errorMessage}. Try refreshing the page or check console for details.`
      );
    } finally {
      setIsLoading(false);
    }
  }, [modelId, initProgressCallback]);

  const generateResponse = useCallback(
    async (prompt: string): Promise<string> => {
      if (!engineRef.current || !isReady) {
        throw new Error("Engine not ready. Please initialize first.");
      }

      try {
        const response = await engineRef.current.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 1000,
        });

        return response.choices[0]?.message?.content || "No response generated";
      } catch (err) {
        console.error("Failed to generate response:", err);
        throw new Error(
          err instanceof Error ? err.message : "Failed to generate response"
        );
      }
    },
    [isReady]
  );

  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current = null;
      }
    };
  }, []);

  return {
    engine,
    isLoading,
    loadingProgress,
    initializeError,
    isReady,
    generateResponse,
    initializeEngine,
  };
};
