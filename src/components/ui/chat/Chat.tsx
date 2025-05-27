import { useCallback, useMemo, useState } from "react";
import { useCodeRunner } from "./useCodeRunner";
import { Button } from "../Button";

const EXAMPLE_CODE = `import time

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

const PythonRunner = () => {
  const [code, setCode] = useState<string | undefined>(undefined);
  const { runPython, output, loading, error } = useCodeRunner();

  const onRunClick = useCallback(() => {
    if (code) {
      runPython(code);
    }
  }, [code, runPython]);

  const onExampleClick = () => setCode(EXAMPLE_CODE);

  const outputString = useMemo(() => {
    if (error) {
      return "An error occured :(";
    }
    if (loading) {
      return "Loading...";
    }
    return output ?? "Result will appear here...";
  }, [error, loading, output]);

  return (
    <div className="w-full max-w-2xl bg-gray-800 text-white rounded-xl shadow-xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-pink-500">Python Runner</h2>
        <div className="flex gap-3">
          <Button
            onPress={onExampleClick}
            text={"Example Code"}
            disabled={loading}
          />
          <Button onPress={onRunClick} text={"Run"} disabled={loading} />
        </div>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Type some Python code..."
        rows={10}
        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-sm font-mono focus:ring-2 focus:ring-pink-500"
      />

      <div className="bg-black border border-pink-500 rounded-lg p-4 text-sm font-mono whitespace-pre-wrap h-[120px] overflow-y-auto">
        {outputString}
      </div>
    </div>
  );
};

export default PythonRunner;
