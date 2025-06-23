import { useCallback, useState, useEffect, useMemo } from "react";
import { MessageCard, type MessageCardProps } from "./MessageCard";
import { CustomButton } from "../CustomButton";
import { extractCodeFromLLMResponse, getFullPrompt } from "@/utils";
import { useCodeRunner } from "@/hooks/useCodeRunner";
import { ChatMessagePlaceholder } from "./ChatMessagePlaceholder";
import { useModelContext } from "@/context/ModelContext";

// TODO this component should only be displayed when it's ready to use
// no engine initialization should take place here
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

  const { generateResponse } = useModelContext();

  // get code response from model and start executing code
  const handlePromptSubmission = useCallback(
    async (prompt: string): Promise<MessageCardProps> => {
      try {
        // generate code through model
        setGenerateCodeLoading(true);

        const fullPrompt = getFullPrompt(prompt.trim());
        const responseText = await generateResponse(fullPrompt);
        const extracedCodeText = extractCodeFromLLMResponse(responseText);

        setGenerateCodeLoading(false);

        // run generated code
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
    if (generateCodeLoading) return "Generating code...";
    if (executeCodeLoading) return "Executing code...";
    return "Generate";
  }, [generateCodeLoading, executeCodeLoading]);

  return (
    <div className="w-full flex flex-col max-w-3xl bg-gray-800 text-white rounded-xl shadow-xl p-6 mb-8 h-[640px]">
      <div className="flex-1 space-y-4 overflow-y-auto pr-2 mb-4">
        {messages.map((item, index) => {
          return <MessageCard key={index} {...item} />;
        })}

        <ChatMessagePlaceholder
          loading={generateCodeLoading}
          text={"Generating..."}
        />
        <ChatMessagePlaceholder
          loading={executeCodeLoading}
          text={"Executing..."}
        />
      </div>

      <div className="flex flex-col space-y-3">
        <textarea
          value={input ?? ""}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your prompt and generate Python code..."
          rows={3}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-sm font-mono focus:ring-2 focus:ring-pink-500"
          disabled={generateCodeLoading || executeCodeLoading}
        />

        <CustomButton
          onPress={onSubmitPress}
          text={buttonText}
          type="primary"
          disabled={!input || generateCodeLoading || executeCodeLoading}
        />
      </div>
    </div>
  );
};
