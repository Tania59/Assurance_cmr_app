import { COLORS } from "../../constants/colors";

interface InputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

export function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: InputProps) {
  return (
    <div>
      <label className="font-inter text-sm font-medium block mb-1.5" style={{ color: COLORS.text }}>
        {label}
        {required && <span style={{ color: COLORS.alert }}> *</span>}
      </label>
      <input
        type={type}
        className="font-inter w-full px-3.5 py-3 rounded-xl text-sm outline-none"
        style={{
          background: "#F0F2F5",
          border: `1.5px solid ${value ? COLORS.secondary : COLORS.border}`,
          color: COLORS.text,
        }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}