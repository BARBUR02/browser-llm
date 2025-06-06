import { useCallback, useMemo, useState } from "react";
import { MessageCard, type MessageCardProps } from "./MessageCard";
import { Button } from "../Button";

export const Chat = () => {
  const [items, setItems] = useState<MessageCardProps[]>([
    { author: "user", text: "hello, generate something" },
    { author: "chat", type: "message", text: "ok" },
  ]);

  const [input, setInput] = useState<string | undefined>(undefined);

  const mappedItems = useMemo(() => {
    return items.map((item) => {
      return <MessageCard {...item} />;
    });
  }, [items]);

  const handleInputSubmit = useCallback(() => {
    if (!input) {
      return;
    }

    const message: MessageCardProps = {
      author: "user",
      text: input,
    };

    setItems((prevItems) => [...prevItems, message]);
    setInput(undefined);

    // todo submit message
  }, [input]);

  return (
    <>
      <div style={{ display: "flex", gap: 20, flexDirection: "column" }}>
        {mappedItems}

        <textarea
          value={input ?? ""}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your prompt and generate Python code..."
          rows={6}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-sm font-mono focus:ring-2 focus:ring-pink-500"
        />
        <Button onPress={handleInputSubmit} text="generate" type="primary" />
      </div>
    </>
  );
};
