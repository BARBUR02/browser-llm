type SelectionProps = {
  value: "ask" | "agent";
  onChange: (val: "ask" | "agent") => void;
};

export const CustomSelection = ({ value, onChange }: SelectionProps) => (
  <div className="flex items-center space-x-4">
    <label className="flex items-center space-x-1 cursor-pointer">
      <input
        type="radio"
        name="chat-mode"
        value="ask"
        checked={value === "ask"}
        onChange={() => onChange("ask")}
        className="accent-pink-500"
      />
      <span>Ask</span>
    </label>
    <label className="flex items-center space-x-1 cursor-pointer">
      <input
        type="radio"
        name="chat-mode"
        value="agent"
        checked={value === "agent"}
        onChange={() => onChange("agent")}
        className="accent-pink-500"
      />
      <span>Agent</span>
    </label>
  </div>
);
