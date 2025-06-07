import { useCallback, useState, useEffect } from "react";
import { MessageCard, type MessageCardProps } from "./MessageCard";
import { Button } from "../Button";
import { useLLMEngine } from "@/hooks/useLLMEngine";
import { extractCodeFromLLMResponse } from "@/utils";

export const Chat = () => {
  const [items, setItems] = useState<MessageCardProps[]>([
    { author: "user", text: "hello, generate something" },
    { author: "chat", type: "message", text: "ok" },
  ]);

  const [input, setInput] = useState<string | undefined>(undefined);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    initializeEngine,
    generateResponse,
    loadingProgress,
    isReady,
    initializeError,
  } = useLLMEngine();

  useEffect(() => {
    initializeEngine();
  }, [initializeEngine]);

  const getResposneMessage = useCallback(
    async (prompt: string): Promise<MessageCardProps> => {
      try {
        setIsSubmitting(true);
        const fullPrompt = `Generate Python code for the following request: "${prompt.trim()}". 
            
        Please provide clean, executable Python code with comments. Include any necessary imports. 
        If the request involves data processing, use basic Python libraries.
        Format your response with the code in a code block, provide only the code as your response.`;

        const responseText = await generateResponse(fullPrompt);
        const extracedCodeText = extractCodeFromLLMResponse(responseText);

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
        setIsSubmitting(false);
      }
    },
    [generateResponse]
  );

  const onSubmitPress = async () => {
    if (!input) return;

    const userMessage: MessageCardProps = {
      author: "user",
      text: input,
    };
    setItems((prevItems) => [...prevItems, userMessage]);
    setInput(undefined);

    const chatMessage = await getResposneMessage(input);
    if (chatMessage) {
      setItems((prevItems) => [...prevItems, chatMessage]);
    } else {
      console.error(
        "this should not happen - button should be blocked in this case"
      );
    }
  };

  const getButtonText = () => {
    if (!isReady) return `Loading model... (${loadingProgress}%)`;
    if (isSubmitting) return "Generating...";
    return "Generate";
  };

  return (
    <>
      <div style={{ display: "flex", gap: 20, flexDirection: "column" }}>
        {items.map((item, index) => {
          return <MessageCard key={index} {...item} />;
        })}

        <textarea
          value={input ?? ""}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your prompt and generate Python code..."
          rows={6}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-sm font-mono focus:ring-2 focus:ring-pink-500"
          disabled={!isReady || isSubmitting}
        />

        <Button
          onPress={onSubmitPress}
          text={getButtonText()}
          type="primary"
          disabled={!input || !isReady || isSubmitting}
        />

        {initializeError && (
          <div style={{ color: "red" }}>⚠️ Engine error: {initializeError}</div>
        )}
      </div>
    </>
  );
};
