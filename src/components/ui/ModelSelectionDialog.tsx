import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChooseModelCard } from "./ChooseModelCard";
import { CustomButton } from "./CustomButton";

export const ModelSelectionDialog = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <CustomButton
          onPress={() => {}}
          text="Try it out"
          type="primary"
          className="mt-4"
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Choose your model</AlertDialogTitle>
          <AlertDialogDescription>
            Choosing the model will start the download process, which may take a
            while depending on your internet connection.
          </AlertDialogDescription>
          <ChooseModelCard />
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};
