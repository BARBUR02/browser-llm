import { MessageCard } from "./MessageCard";

type ChatMessagePlaceholderProps = {
  loading: boolean;
};

export const ChatMessagePlaceholder = ({
  loading,
}: ChatMessagePlaceholderProps) => {
  return (
    <>
      {loading && (
        <MessageCard author="chat" type="message" text="Loading..." />
      )}
    </>
  );
};
