import { ModelProvider } from "./context/ModelContext";
import { Footer } from "./components/Footer";
import { ChooseModelCard } from "./components/ui/ChooseModelCard";
import { LandingCard } from "./components/ui/LandingCard";
import { Chat } from "./components/ui/Chat/Chat";

function App() {
  return (
    <ModelProvider>
      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        <div className="flex flex-1 mt-16 gap-10 justify-center">
          <div className="flex flex-col gap-8">
            <LandingCard />
            <ChooseModelCard />
          </div>

          <Chat />
        </div>

        <Footer />
      </div>
    </ModelProvider>
  );
}
export default App;
