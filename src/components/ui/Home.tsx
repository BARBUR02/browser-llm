import { Footer } from "../Footer";
import { Header } from "../Header";
import { Chat } from "./Chat/Chat";
import { ChooseModelCard } from "./ChooseModelCard";
import { LandingCard } from "./LandingCard";
import { useModelContext } from "@/context/ModelContext";
import { ModelSelectionDialog } from "./ModelSelectionDialog";

export const Home = () => {
  const { readyToUse, isInitRun } = useModelContext();

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white pb-4">
      <Header />
      <div className="flex flex-1 pt-24 gap-10 justify-center">
        <div className="flex flex-col gap-8 items-center">
          {!isInitRun && (
            <>
              <LandingCard />
              <ModelSelectionDialog />
            </>
          )}
        </div>

        {isInitRun && (
          <>
            <ChooseModelCard />
            {readyToUse && <Chat />}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};
