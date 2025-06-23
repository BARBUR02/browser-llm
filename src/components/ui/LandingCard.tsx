import { Button } from "./Button";

interface LandingCardProps {
  onTryItOut: () => void;
}

export const LandingCard = ({ onTryItOut }: LandingCardProps) => {
  return (
    <header className="text-center flex flex-col items-center gap-4">
      <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        Browser LLM
      </h1>
      <p className="text-gray-400 mt-2 max-w-2xl">
        Run Large Language Models directly in your browser with the power of
        WebAssembly. This project leverages the transformers.js library to bring
        state-of-the-art AI models to the client-side, ensuring privacy and
        removing the need for a server backend.
      </p>
      <Button onPress={onTryItOut} text="Try it out" type="primary" className="mt-4" />
    </header>
  );
};
