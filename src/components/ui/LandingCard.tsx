export const LandingCard = () => {
  return (
    <header className="text-center flex flex-col items-center gap-6 p-4">
      <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-600 animate-gradient-x">
        Browser LLM
      </h1>
      <p className="text-lg text-gray-300 mt-2 max-w-3xl">
        Experience the future of AI, right in your browser. This project
        leverages the power of <strong>WebLLM</strong> and{" "}
        <strong>transformers.js</strong> to run large language models entirely
        on the client-side. But it doesn't stop there. Our Browser LLM acts as
        an intelligent agent, capable of understanding your prompts and{" "}
        <strong>executing Python code</strong> to perform complex tasks.
      </p>

      <div className="w-full max-w-4xl mt-8 grid md:grid-cols-2 gap-8 text-left">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold text-pink-400 mb-3">
            The Business Advantage
          </h2>
          <p className="text-gray-400">
            By eliminating the need for expensive server infrastructure, Browser
            LLM dramatically reduces operational costs. With its ability to
            execute code, it opens up new possibilities for in-browser data
            analysis, prototyping, and interactive tutorials without
            compromising on data privacy.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold text-purple-400 mb-3">
            Agent Mode: Your AI-Powered Assistant
          </h2>
          <p className="text-gray-400">
            Our Browser LLM takes this a step further with its{" "}
            <strong>Agent Mode</strong>. It can interpret your requests, write
            and execute Python code, and deliver results, all within the secure
            sandbox of your browser. This unlocks a new class of applications
            for developers and data scientists.
          </p>
        </div>
      </div>

      <div className="w-full max-w-4xl mt-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-purple-600 rounded-full">
              <span className="text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Choose a Model</h3>
            <p className="text-gray-400">
              Select from a variety of available open-source models.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-pink-600 rounded-full">
              <span className="text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Download & Cache</h3>
            <p className="text-gray-400">
              The model is downloaded and cached in your browser for offline
              use.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-red-600 rounded-full">
              <span className="text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Prompt & Execute</h3>
            <p className="text-gray-400">
              Interact with the model in agent mode. Give it a task, and watch
              it execute Python code to get the job done.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-12 text-lg text-gray-300">Ready to give it a try?</p>
    </header>
  );
};
