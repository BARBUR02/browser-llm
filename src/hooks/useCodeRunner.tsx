import { useEffect, useRef, useState } from "react";

export const useCodeRunner = () => {
  const workerRef = useRef<Worker | null>(null);

  const [result, setResult] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  // init worker and start listening to messages
  useEffect(() => {
    const worker = new Worker(`${import.meta.env.BASE_URL}worker.js`);
    workerRef.current = worker;

    worker.onmessage = (e) => {
      if (e.data.type === "success") {
        setResult(e.data.result);
        setError(undefined);
        console.log("success")
      } else {
        setResult(undefined);
        setError(e.data.error);
        console.log("error", e.data.error);
      }
      setLoading(false);
    };

    return () => worker.terminate();
  }, []);

  const runPython = (code: string) => {
    console.log("runPython called:");
    if (workerRef.current) {
      console.log("Running Python code:");
      setLoading(true);
      workerRef.current.postMessage(code);
    }
  };

  return { runPython, result, loading, error };
};
