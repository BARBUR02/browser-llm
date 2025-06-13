import { useCallback, useState, useEffect, useMemo } from "react";
import { MessageCard, type MessageCardProps } from "./MessageCard";
import { Button } from "../Button";
import { extractCodeFromLLMResponse } from "@/utils";
import { useCodeRunner } from "@/hooks/useCodeRunner";
import { ChatMessagePlaceholder } from "./ChatMessagePlaceholder";
import { useModelContext } from "@/context/ModelContext";

// TODO this component should only take modelId and be displayed when it's ready to use
// no initialization should take place here
export const Chat = () => {
  const [input, setInput] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<MessageCardProps[]>([]);

  const [generateCodeLoading, setGenerateCodeLoading] = useState(false);

  const {
    runPython,
    result: executeCodeResult,
    loading: executeCodeLoading,
    error: executeCodeError,
  } = useCodeRunner();

  const {
    generateResponse,
    initProgress: loadingProgress,
    readyToUse: isReady,
  } = useModelContext();

  // get code response from model and start executing code
  const handlePromptSubmission = useCallback(
    async (prompt: string): Promise<MessageCardProps> => {
      try {
        setGenerateCodeLoading(true);
        const fullPrompt = `Generate Python code for the following request: "${prompt.trim()}". 

Please provide clean, executable Python code with comments. Include any necessary imports. 
If the request involves data processing, use basic Python libraries.
Format your response with the code in a code block, provide only the code as your response.`;

        const responseText = await generateResponse(fullPrompt);
        const extracedCodeText = extractCodeFromLLMResponse(responseText);

        runPython(extracedCodeText);

        const chatMessage: MessageCardProps = {
          author: "chat",
          type: "code",
          text: extracedCodeText,
        };

        return chatMessage;
      } catch (err) {
        const errorText =
          err instanceof Error
            ? err.message
            : "Unknown error generating response";

        const chatMessage: MessageCardProps = {
          author: "chat",
          type: "message",
          text: `⚠️ Error: ${errorText}`,
        };

        return chatMessage;
      } finally {
        setGenerateCodeLoading(false);
      }
    },
    [generateResponse, runPython],
  );

  // create message with executed Python code result
  useEffect(() => {
    if (!executeCodeLoading && (executeCodeResult || executeCodeError)) {
      if (executeCodeResult) {
        const message: MessageCardProps = {
          author: "chat",
          type: "code",
          text: executeCodeResult,
        };
        setMessages((prevItems) => [...prevItems, message]);
      } else {
        const message: MessageCardProps = {
          author: "chat",
          type: "message",
          text: executeCodeError ?? "something went wrong",
        };
        setMessages((prevItems) => [...prevItems, message]);
      }
    }
  }, [executeCodeLoading, executeCodeResult, executeCodeError]);

  const onSubmitPress = async () => {
    if (!input) return;

    const userMessage: MessageCardProps = {
      author: "user",
      text: input,
    };
    setMessages((prevItems) => [...prevItems, userMessage]);
    setInput(undefined);

    const chatMessage = await handlePromptSubmission(input);
    setMessages((prevItems) => [...prevItems, chatMessage]);
  };

  const buttonText = useMemo(() => {
    if (!isReady) return `Loading model... (${loadingProgress}%)`;
    if (generateCodeLoading) return "Generating code...";
    if (executeCodeLoading) return "Executing code...";
    return "Generate";
  }, [isReady, loadingProgress, generateCodeLoading, executeCodeLoading]);

  return (
    <div className="w-full flex flex-col max-w-3xl bg-gray-800 text-white rounded-xl shadow-xl p-6 mb-8 h-[640px]">
      <div className="flex-1 space-y-4 overflow-y-auto pr-2 mb-4">
        {messages.map((item, index) => {
          return <MessageCard key={index} {...item} />;
        })}

        <ChatMessagePlaceholder loading={generateCodeLoading} />
        <ChatMessagePlaceholder loading={executeCodeLoading} />
      </div>

      <div className="flex flex-col space-y-3">
        <textarea
          value={input ?? ""}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your prompt and generate Python code..."
          rows={4}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-sm font-mono focus:ring-2 focus:ring-pink-500"
          disabled={!isReady || generateCodeLoading || executeCodeLoading}
        />

        <Button
          onPress={onSubmitPress}
          text={buttonText}
          type="primary"
          disabled={
            !input || !isReady || generateCodeLoading || executeCodeLoading
          }
        />
      </div>
    </div>
  );
};
