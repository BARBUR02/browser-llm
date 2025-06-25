import { useEffect, useRef, useState } from "react";

export const useCodeRunner = () => {
  const workerRef = useRef<Worker | null>(null);

  const [result, setResult] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  // init worker and start listening to messages
  useEffect(() => {
    const worker = new Worker(`${import.meta.env.BASE_URL}worker.js`);
    workerRef.current = worker;

    worker.onmessage = (e) => {
      if (e.data.type === "success") {
        setResult(e.data.result);
      } else {
        setResult(undefined);
        setError(e.data.error);
      }

      setLoading(false);
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

  return { runPython, result, loading, error, setResult, setError };
};
