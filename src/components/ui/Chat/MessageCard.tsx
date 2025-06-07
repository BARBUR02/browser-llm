export type MessageCardProps =
  | { author: "user"; text: string }
  | { author: "chat"; type: "code" | "message"; text: string };

export const MessageCard = (props: MessageCardProps) => {
  const { author, text } = props;

  const isUser = author === "user";
  const isCode = author === "chat" && props.type === "code";

  const containerClass = isUser
    ? "bg-gray-700 text-white self-end text-sm font-mono"
    : isCode
      ? "bg-gray-900 border border-green-500 text-green-400 font-mono"
      : "bg-gray-700 text-white self-start";

  return (
    <div
      className={`max-w-[80%] rounded-xl p-4 shadow-md ${containerClass} whitespace-pre-wrap`}
    >
      {text}
    </div>
  );
};
