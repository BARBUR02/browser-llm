import { useState } from "react";
import { useCodeRunner } from "./useCodeRunner";

const PythonRunner = () => {
  const [code, setCode] = useState<string | undefined>(undefined);
  const { runPython, output } = useCodeRunner();

  const onButtonPress = () => {
    if (code) {
      runPython(code);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-gray-800 text-white rounded-xl shadow-xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-pink-500">Python Runner</h2>
        <button
          onClick={onButtonPress}
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Run
        </button>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Type some Python code..."
        rows={10}
        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-sm font-mono focus:ring-2 focus:ring-pink-500"
      />

      <div className="bg-black border border-pink-500 rounded-lg p-4 text-sm font-mono whitespace-pre-wrap h-[120px] overflow-y-auto">
        {output || "Output will appear here..."}
      </div>
    </div>
  );
};

export default PythonRunner;
