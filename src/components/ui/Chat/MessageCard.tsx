export type MessageCardProps =
  | { author: "user"; text: string }
  | { author: "chat"; type: "code" | "message" | "error"; text: string };

export const MessageCard = (props: MessageCardProps) => {
  const { author, text } = props;

  const isUser = author === "user";
  const isCode = author === "chat" && props.type === "code";
  const isError = author === "chat" && props.type === "error";
  const isMessage = author === "chat" && props.type === "message";

  const containerClass = isUser
    ? "bg-green-500 text-white text-sm font-mono"
    : isCode
      ? "bg-gray-900 border border-green-500 text-green-400 font-mono"
      : isError
        ? "bg-gray-900 border border-red-500 text-red-400 font-mono"
        : isMessage
          ? "bg-gray-700 border border-gray-500 text-gray-200 font-mono"
          : "bg-gray-700 text-white";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-xl p-4 shadow-md ${containerClass} whitespace-pre-wrap`}
      >
        {text}
      </div>
    </div>
  );
};