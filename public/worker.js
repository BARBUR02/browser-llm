let pyodideReadyPromise = null;

const PYODIDE_SCRIPT_URL =
  "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/";

const PYTHON_STDOUT_SETUP_CODE = `
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = sys.stdout
`;

const PYTHON_STDOUT_READ_CODE = "sys.stdout.getvalue()";

self.onmessage = async (event) => {
  const code = event.data;

  // init worker environment
  if (!pyodideReadyPromise) {
    importScripts(PYODIDE_SCRIPT_URL);
    pyodideReadyPromise = loadPyodide({
      indexURL: PYODIDE_INDEX_URL,
    });
  }

  const pyodide = await pyodideReadyPromise;

  // needed for installing packages
  await pyodide.loadPackage(["micropip"]);

  try {
    pyodide.runPython(PYTHON_STDOUT_SETUP_CODE);
    pyodide.runPython(code);
    const result = pyodide.runPython(PYTHON_STDOUT_READ_CODE);

    self.postMessage({ type: "success", result });
  } catch (err) {
    self.postMessage({ type: "error", error: err.message });
  }
};
