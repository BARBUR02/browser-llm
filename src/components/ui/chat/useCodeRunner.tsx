import { useEffect, useRef, useState } from "react";

export const useCodeRunner = () => {
  const workerRef = useRef<Worker | null>(null);

  const [result, setResult] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  // init worker and start listening to messages
  useEffect(() => {
    const worker = new Worker("/worker.js");
    workerRef.current = worker;

    worker.onmessage = (e) => {
      setLoading(false);

      if (e.data.type === "success") {
        setResult(e.data.result);
      } else {
        setResult(undefined);
        setError(e.data.error);
      }
    };

    return () => worker.terminate();
  }, []);

  const runPython = (code: string) => {
    if (workerRef.current) {
      setLoading(true);
      setError(undefined);
      setResult(undefined);
      workerRef.current.postMessage(code);
    }
  };

  return { runPython, output: result, loading, error };
};
