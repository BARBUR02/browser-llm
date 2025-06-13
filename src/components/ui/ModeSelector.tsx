import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AVAILABLE_MODES = [
  { id: "ask", name: "Ask" },
  { id: "agent", name: "Agent" },
];

interface ModeSelectorProps {
  value: string;
  onChange: (mode: string) => void;
}

export const ModeSelector = ({ value, onChange }: ModeSelectorProps) => (
  <div>
    <label className="block text-sm font-medium text-green-400 mb-1">
      Mode
    </label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white focus:ring-green-500">
        <SelectValue placeholder="Select mode" />
      </SelectTrigger>
      <SelectContent className="bg-gray-700 border-gray-600 text-white">
        {AVAILABLE_MODES.map((mode) => (
          <SelectItem key={mode.id} value={mode.id}>
            {mode.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
