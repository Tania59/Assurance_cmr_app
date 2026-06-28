import { ChevronDown } from "lucide-react";
import { COLORS } from "../../constants/colors";

interface SelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}

export function Select({ label, value, onChange, options }: SelectProps) {
  return (
    <div>
      <label className="font-inter text-sm font-medium block mb-1.5" style={{ color: COLORS.text }}>
        {label}
      </label>
      <div className="relative">
        <select
          className="font-inter w-full px-3.5 py-3 rounded-xl text-sm outline-none appearance-none"
          style={{
            background: "#F0F2F5",
            border: `1.5px solid ${value ? COLORS.secondary : COLORS.border}`,
            color: value ? COLORS.text : COLORS.muted,
          }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          color={COLORS.muted}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        />
      </div>
    </div>
  );
}