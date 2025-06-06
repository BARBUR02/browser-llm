export type MessageCardProps =
  | { author: "user"; text: string }
  | { author: "chat"; type: "code" | "message"; text: string };

export const MessageCard = (props: MessageCardProps) => {
  const { author, text } = props;

  const getAuthorStyles = () => {
    return author === "user"
      ? { backgroundColor: "pink", marginLeft: 200 }
      : { backgroundColor: "lightblue", marginRight: 200 };
  };
  return (
    <div
      style={{
        padding: 20,
        ...getAuthorStyles(),
      }}
    >
      {text}
    </div>
  );
};
