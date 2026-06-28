import { COLORS } from "../../constants/colors";

interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, action, onAction }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-montserrat font-bold text-base" style={{ color: COLORS.text }}>
        {title}
      </h2>
      {action && (
        <button
          className="font-inter text-sm font-semibold"
          style={{ color: COLORS.secondary }}
          onClick={onAction}
        >
          {action}
        </button>
      )}
    </div>
  );
}