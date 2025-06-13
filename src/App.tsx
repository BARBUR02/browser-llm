import { ModelProvider } from "./context/ModelContext";
import { Footer } from "./components/Footer";
import { ChooseModelCard } from "./components/ui/ChooseModelCard";
import { LandingCard } from "./components/ui/LandingCard";
import { Chat } from "./components/ui/Chat/Chat";

function App() {
  return (
    <ModelProvider>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 space-y-8">
        <LandingCard />
        <ChooseModelCard />
        <Chat />
        <Footer />
      </div>
    </ModelProvider>
  );
}
export default App;
