import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";

interface InitModelLoadingProps {
  isLoading: boolean;
  progress: number;
}

export const InitModelLoading = ({
  isLoading,
  progress,
}: InitModelLoadingProps) => {
  return (
    <AlertDialog open={isLoading}>
      <AlertDialogContent className="bg-gray-800 border-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-pink-400">
            Initializing Model...
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Please wait while we download and cache the model. This may take a
            few moments and can be up to 5GB.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="w-full p-4 rounded-lg transition-all duration-300 ease-in-out">
          <div className="space-y-3">
            <div className="flex justify-end items-center">
              <p className="text-sm font-mono text-gray-400">
                {progress.toFixed(2)}%
              </p>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
