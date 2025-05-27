type ButtonProps = {
  onPress: () => void;
  text: string;
  disabled?: boolean;
};

export const Button = ({ onPress, text, disabled }: ButtonProps) => {
  return (
    <button
      onClick={onPress}
      className="bg-pink-600 hover:bg-pink-700 disabled:bg-pink-900 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      disabled={disabled}
    >
      {text}
    </button>
  );
};
