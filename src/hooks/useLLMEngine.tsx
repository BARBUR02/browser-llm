import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { CreateMLCEngine, MLCEngine } from "@mlc-ai/web-llm";

interface UseLLMEngineReturn {
  isInitLoading: boolean;
  initProgress: number;
  initError: string | undefined;
  isInitRun: boolean;
  readyToUse: boolean;
  generateResponse: (prompt: string) => Promise<string>;
  initialize: (modelId: string) => Promise<void>;
}

type ProgressEvent = {
  progress?: number;
};

export const useLLMEngine = (): UseLLMEngineReturn => {
  const [engine, setEngine] = useState<MLCEngine | undefined>(undefined);
  const engineRef = useRef<MLCEngine | null>(null);

  const [isInitLoading, setIsInitLoading] = useState(false);
  const [isInitRun, setIsInitRun] = useState(false);
  const [initProgress, setInitProgress] = useState(0);
  const [initError, setInitError] = useState<string | undefined>(undefined);

  const readyToUse = useMemo(() => {
    if (!isInitLoading && !initError && engine) {
      return true;
    }
    return false;
  }, [engine, initError, isInitLoading]);

  const initProgressCallback = useCallback((progress: ProgressEvent) => {
    console.log("Model loading progress:", progress);
    if (progress.progress !== undefined) {
      setInitProgress(Math.round(progress.progress * 100));
    }
  }, []);

  const initialize = useCallback(
    async (modelId: string) => {
      setIsInitRun(true);
      setIsInitLoading(true);
      setInitError(undefined);
      setInitProgress(0);

      try {
        console.log(`Attempting to initialize model: ${modelId}`);
        const newEngine = await CreateMLCEngine(modelId, {
          initProgressCallback,
        });

        console.log("Engine initialized successfully");
        engineRef.current = newEngine;
        setEngine(newEngine);
      } catch (err) {
        console.error("Failed to initialize LLM engine:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to initialize engine";

        setInitError(
          `${errorMessage}. Try refreshing the page or check console for details.`,
        );
        setEngine(undefined);
        engineRef.current = null;
      } finally {
        setIsInitLoading(false);
        setInitProgress(100);
      }
    },
    [initProgressCallback],
  );

  const generateResponse = useCallback(
    async (prompt: string): Promise<string> => {
      if (!engineRef.current || !readyToUse) {
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
          err instanceof Error ? err.message : "Failed to generate response",
        );
      }
    },
    [readyToUse],
  );

  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current = null;
      }
    };
  }, []);

  return {
    isInitLoading,
    initProgress,
    initError,
    isInitRun,
    readyToUse,
    generateResponse,
    initialize,
  };
};
