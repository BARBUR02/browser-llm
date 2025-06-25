import { MessageCard } from "./MessageCard";

type ChatMessagePlaceholderProps = {
  loading: boolean;
  text?: string;
};

export const ChatMessagePlaceholder = ({
  loading,
  text = "",
}: ChatMessagePlaceholderProps) => {
  return (
    <>
      {loading && (
        <MessageCard
          author="chat"
          type="animatedMessage"
          text={text}
        />
      )}
    </>
  );
};
