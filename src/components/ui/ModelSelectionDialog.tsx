import { ChooseModelCard } from "./ChooseModelCard";
import { CustomButton } from "./CustomButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

export const ModelSelectionDialog = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <CustomButton
          onPress={() => {}}
          text="Try it out"
          type="primary"
          className="mt-4"
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose your model</DialogTitle>
          <DialogDescription>
            Choosing the model will start the download process, which may take a
            while depending on your internet connection.
          </DialogDescription>
          <ChooseModelCard />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
