/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/";

async function loadPyodideAndPackages() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pyodide = await (window as any).loadPyodide({
    indexURL: PYODIDE_URL,
  });

  await pyodide.loadPackage(["micropip"]);
  return pyodide;
}

export const useCodeRunner = () => {
  const [pyodide, setPyodide] = useState<any>(null);

  const [output, setOutput] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  // assumption that useCodeRunner will be called onced inside chat
  useEffect(() => {
    loadPyodideAndPackages()
      .then(setPyodide)
      .catch(() => console.log("loading failed"));
  }, []);

  const runPython = async (code: string) => {
    if (pyodide) {
      setLoading(true);
      setError(false);

      try {
        pyodide.runPython(`
          import sys
          from io import StringIO
          sys.stdout = StringIO()
          sys.stderr = sys.stdout
          `);

        pyodide.runPython(code);
        const result = pyodide.runPython("sys.stdout.getvalue()");
        setOutput(result ?? undefined);
      } catch (err: any) {
        setOutput(`Error: ${err.message}`);
        setError(true);
      }

      setLoading(false);
    }
  };

  return { runPython, output, loading, error };
};
