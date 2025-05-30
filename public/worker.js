let pyodideReadyPromise = null;

const PYODIDE_SCRIPT_URL =
  "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/";

const PYTHON_STDOUT_SETUP = `
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = sys.stdout
`;

const PYTHON_STDOUT_READ = "sys.stdout.getvalue()";

self.onmessage = async (event) => {
  const code = event.data;

  // init worker environment
  if (!pyodideReadyPromise) {
    importScripts(PYODIDE_SCRIPT_URL);
    pyodideReadyPromise = (async () => {
      const pyodide = await loadPyodide({ indexURL: PYODIDE_INDEX_URL });
      await pyodide.loadPackage(["micropip"]); // Load micropip during initialization
      return pyodide;
    })();
  }

  const pyodide = await pyodideReadyPromise;
  try {
    await pyodide.runPythonAsync(PYTHON_STDOUT_SETUP);
    await pyodide.runPythonAsync(code);
    const result = await pyodide.runPythonAsync(PYTHON_STDOUT_READ);

    self.postMessage({ type: "success", result });
  } catch (err) {
    self.postMessage({ type: "error", error: err.message });
  }
};
