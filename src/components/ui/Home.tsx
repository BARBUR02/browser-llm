import { Footer } from "../Footer";
import { Chat } from "./Chat/Chat";
import { ChooseModelCard } from "./ChooseModelCard";
import { LandingCard } from "./LandingCard";
import { useModelContext } from "@/context/ModelContext";

export const Home = () => {
  const { readyToUse } = useModelContext();

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white pb-4">
      <div className="flex flex-1 mt-16 gap-10 justify-center">
        <div className="flex flex-col gap-8">
          <LandingCard />
          <ChooseModelCard />
        </div>

        {readyToUse && <Chat />}
      </div>

      <Footer />
    </div>
  );
};
