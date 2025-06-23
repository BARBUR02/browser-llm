type ButtonProps = {
  onPress: () => void;
  text: string;
  type: "secondary" | "primary";
  disabled?: boolean;
  className?: string;
};

export const Button = ({ onPress, text, disabled, type, className }: ButtonProps) => {
  const baseClasses =
    "font-semibold py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed";
  const primaryClasses =
    "bg-pink-600 hover:bg-pink-700 disabled:bg-pink-900 text-white";
  const secondaryClasses =
    "bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600 disabled:bg-gray-800";

  const typeClasses =
    type === "primary"
      ? primaryClasses
      : secondaryClasses;

  const finalClass = `${baseClasses} ${typeClasses} ${className || ''}`;

  return (
    <button onClick={onPress} className={finalClass} disabled={disabled}>
      {text}
    </button>
  );
};
