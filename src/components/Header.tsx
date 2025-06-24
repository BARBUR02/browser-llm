import { Rocket } from "lucide-react";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Rocket className="h-6 w-6 text-pink-500" />
          <h1 className="text-xl font-bold text-white">Browser LLM</h1>
        </div>
        {/* Navigation links can be added here later */}
      </div>
    </header>
  );
};
