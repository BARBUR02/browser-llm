import { useCallback, useMemo, useState, useEffect } from "react";
import { useCodeRunner } from "../../hooks/useCodeRunner";
import { CustomButton } from "./CustomButton";

const PRIMES_CODE = `import time

def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

count = 0
num = 2

while count < 10:
    if is_prime(num):
        print(num)
        time.sleep(0.1)
        count += 1
    num += 1`;

// to install packages micropip is necessary
const NUMPY_CODE = `import micropip
await micropip.install("numpy")

import numpy as np

a = np.array([1, 2, 3, 4, 5])
b = a ** 2

for x, y in zip(a, b):
    print(f"{x} squared is {y}")`;

interface CodeSectionProps {
  generatedCode?: string;
}

export const CodeSection = ({ generatedCode }: CodeSectionProps) => {
  const [code, setCode] = useState<string | undefined>(undefined);
  const { runPython, result, loading, error } = useCodeRunner();

  useEffect(() => {
    if (generatedCode) {
      setCode(generatedCode);
    }
  }, [generatedCode]);

  const onRunClick = useCallback(() => {
    if (code) {
      runPython(code);
    }
  }, [code, runPython]);

  const outputString = useMemo(() => {
    if (error) return error;
    if (loading) return "Loading...";
    return result ?? "Result will appear here...";
  }, [error, loading, result]);

  return (
    <div className="w-full bg-gray-800 text-white rounded-xl shadow-xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-pink-500">Python Runner</h2>
        <div className="flex gap-3">
          <CustomButton
            onPress={() => setCode(PRIMES_CODE)}
            text="Primes"
            disabled={loading}
            type="secondary"
          />
          <CustomButton
            onPress={() => setCode(NUMPY_CODE)}
            text="Numpy"
            disabled={loading}
            type="secondary"
          />
          <CustomButton
            onPress={onRunClick}
            text="Run"
            disabled={loading}
            type="primary"
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-pink-400">Code Editor</h3>
        <textarea
          value={code || ""}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Type some Python code here or generate it using the AI prompt above..."
          rows={12}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-sm font-mono focus:ring-2 focus:ring-pink-500"
        />
        <div className="bg-black border border-pink-500 rounded-lg p-4 text-sm font-mono whitespace-pre-wrap h-[200px] overflow-y-auto">
          <div className="text-pink-400 mb-2">Python Output:</div>
          {outputString}
        </div>
      </div>
    </div>
  );
};
