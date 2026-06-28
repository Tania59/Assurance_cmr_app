import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { COLORS } from "../../constants/colors";

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  action?: ReactNode;
}

export function ScreenHeader({ title, onBack, action }: ScreenHeaderProps) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
      style={{ background: COLORS.primary, minHeight: 56 }}
    >
      {onBack && (
        <button onClick={onBack} className="p-1 -ml-1">
          <ArrowLeft size={22} color="#fff" />
        </button>
      )}
      <h1 className="font-montserrat font-bold text-lg flex-1" style={{ color: "#fff" }}>
        {title}
      </h1>
      {action}
    </div>
  );
}