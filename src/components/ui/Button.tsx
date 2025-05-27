type ButtonProps = {
  onPress: () => void;
  text: string;
  type: "secondary" | "primary";
  disabled?: boolean;
};

export const Button = ({ onPress, text, disabled, type }: ButtonProps) => {
  const baseClasses =
    "font-semibold py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed";
  const primaryClasses =
    "bg-pink-600 hover:bg-pink-700 disabled:bg-pink-900 text-white";
  const secondaryClasses =
    "bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600 disabled:bg-gray-800";

  const finalClass =
    type === "primary"
      ? `${baseClasses} ${primaryClasses}`
      : `${baseClasses} ${secondaryClasses}`;

  return (
    <button onClick={onPress} className={finalClass} disabled={disabled}>
      {text}
    </button>
  );
};
