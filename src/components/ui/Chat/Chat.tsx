import { useCallback, useState, useEffect, useMemo, useRef } from "react";
import { MessageCard, type MessageCardProps } from "./MessageCard";
import { CustomButton } from "../CustomButton";
import { extractCodeFromLLMResponse, getFullPrompt } from "@/utils";
import { useCodeRunner } from "@/hooks/useCodeRunner";
import { ChatMessagePlaceholder } from "./ChatMessagePlaceholder";
import { useModelContext } from "@/context/ModelContext";
import { CustomSelection } from "../CustomSelection";

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
    setResult: setExecuteCodeResult,
    setError: setExecuteCodeError,
  } = useCodeRunner();

  const { generateResponse } = useModelContext();

  const [mode, setMode] = useState<"ask" | "agent">("ask");
  const [agentRetryCount, setAgentRetryCount] = useState(0);
  const maxAgentRetries = 5;

  // Keep track of last user prompt and last generated code for agent mode
  const lastUserPromptRef = useRef<string | undefined>(undefined);
  const lastGeneratedCodeRef = useRef<string | undefined>(undefined);

  // get code response from model and start executing code
  const handlePromptSubmission = useCallback(
    async (
      prompt: string,
      agentContext?: { code?: string; error?: string },
    ): Promise<MessageCardProps> => {
      try {
        setGenerateCodeLoading(true);

        // Use mode and context for prompt construction
        const fullPrompt = getFullPrompt(prompt.trim(), mode, agentContext);
        const responseText = await generateResponse(fullPrompt);
        const extracedCodeText = extractCodeFromLLMResponse(responseText);

        setGenerateCodeLoading(false);

        // Save for agent mode
        lastUserPromptRef.current = prompt;
        lastGeneratedCodeRef.current = extracedCodeText;

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
          type: "error",
          text: `⚠️ Error: ${errorText}`,
        };

        return chatMessage;
      } finally {
        setGenerateCodeLoading(false);
      }
    },
    [generateResponse, runPython, mode],
  );

  // Agent mode: construct a new prompt using history, code, and error
  const handleAgentRetry = useCallback(async () => {
    if (
      agentRetryCount >= maxAgentRetries ||
      !lastUserPromptRef.current ||
      !lastGeneratedCodeRef.current ||
      !executeCodeError
    ) {
      // Reset agent state if max retries reached or missing context
      setAgentRetryCount(0);
      lastUserPromptRef.current = undefined;
      lastGeneratedCodeRef.current = undefined;
      return;
    }

    // Add agent retry message
    const agentMessage: MessageCardProps = {
      author: "chat",
      type: "message",
      text: `Agent retry #${agentRetryCount + 1}: Trying to fix the error...`,
    };
    setMessages((prevItems) => [...prevItems, agentMessage]);

    setAgentRetryCount((count) => count + 1);

    // Submit the agent prompt using the new context
    const chatMessage = await handlePromptSubmission(
      lastUserPromptRef.current,
      {
        code: lastGeneratedCodeRef.current,
        error: executeCodeError,
      },
    );
    setMessages((prevItems) => [...prevItems, chatMessage]);
  }, [
    agentRetryCount,
    maxAgentRetries,
    executeCodeError,
    handlePromptSubmission,
  ]);

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
        setExecuteCodeResult(undefined);

        if (mode === "agent") {
          setAgentRetryCount(0);
          lastUserPromptRef.current = undefined;
          lastGeneratedCodeRef.current = undefined;
        }
      } else {
        const errorText = executeCodeError ?? "Unknown error executing code";
        const message: MessageCardProps = {
          author: "chat",
          type: "error",
          text: `⚠️ Error: ${errorText}`,
        };
        setMessages((prevItems) => [...prevItems, message]);
        setExecuteCodeError(undefined);

        // Agent mode
        if (mode === "agent" && agentRetryCount < maxAgentRetries) {
          handleAgentRetry();
        } else if (mode === "agent" && agentRetryCount >= maxAgentRetries) {
          const message: MessageCardProps = {
            author: "chat",
            type: "message",
            text: `⚠️ Agent stopped after ${maxAgentRetries} retries.`,
          };
          setMessages((prevItems) => [...prevItems, message]);

          setAgentRetryCount(0);
          lastUserPromptRef.current = undefined;
          lastGeneratedCodeRef.current = undefined;
        }
      }
    }
  }, [
    executeCodeLoading,
    executeCodeResult,
    executeCodeError,
    mode,
    agentRetryCount,
    maxAgentRetries,
    handleAgentRetry,
    setExecuteCodeResult,
    setExecuteCodeError,
  ]);

  const onSubmitPress = async () => {
    if (!input) return;

    const userMessage: MessageCardProps = {
      author: "user",
      text: input,
    };
    setMessages((prevItems) => [...prevItems, userMessage]);
    setInput(undefined);

    // Save last user prompt for agent mode
    lastUserPromptRef.current = input;

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

        <ChatMessagePlaceholder loading={generateCodeLoading} />
        <ChatMessagePlaceholder loading={executeCodeLoading} />
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

        <div className="flex items-center space-x-4">
          <CustomButton
            onPress={onSubmitPress}
            text={buttonText}
            type="primary"
            disabled={!input || generateCodeLoading || executeCodeLoading}
          />
          <CustomSelection value={mode} onChange={setMode} />
        </div>
      </div>
    </div>
  );
};
