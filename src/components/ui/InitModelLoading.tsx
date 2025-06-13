import { Progress } from "@radix-ui/react-progress";
import { useEffect } from "react";

interface InitModelLoadingPRops {
  isLoading: boolean;
  progress: number;
}

export const InitModelLoading = ({
  isLoading,
  progress,
}: InitModelLoadingPRops) => {
  useEffect(() => console.log(progress), [progress]);
  return (
    isLoading && (
      <div className="w-full">
        <div className="space-y-2">
          <div className="text-center text-green-400">
            Loading LLM... {progress}%
          </div>
          <Progress
            value={progress}
            className="w-full [&>div]:bg-green-500 bg-gray-700"
          />
        </div>
      </div>
    )
  );
};
