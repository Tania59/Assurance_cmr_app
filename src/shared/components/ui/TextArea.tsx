import { COLORS } from "../../constants/colors";

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function TextArea({ label, value, onChange, placeholder }: TextAreaProps) {
  return (
    <div>
      <label className="font-inter text-sm font-medium block mb-1.5" style={{ color: COLORS.text }}>
        {label}
      </label>
      <textarea
        className="font-inter w-full px-3.5 py-3 rounded-xl text-sm outline-none resize-none"
        style={{
          background: "#F0F2F5",
          border: `1.5px solid ${value ? COLORS.secondary : COLORS.border}`,
          color: COLORS.text,
        }}
        rows={3}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}