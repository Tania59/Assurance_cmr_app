import type{ ReactNode } from "react";
import { COLORS } from "../../constants/colors";

interface KPICardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  icon?: ReactNode;
  alert?: boolean;
}

export function KPICard({
  label,
  value,
  sub,
  color = COLORS.primary,
  icon,
  alert = false,
}: KPICardProps) {
  return (
    <div
      className="flex-1 bg-white rounded-xl p-3 flex flex-col gap-1"
      style={{
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        border: `1px solid ${alert ? "#FEE2E2" : COLORS.border}`,
      }}
    >
      {icon && <div style={{ color: alert ? COLORS.alert : color }}>{icon}</div>}
      <p
        className="font-jetbrains font-semibold text-xl"
        style={{ color: alert ? COLORS.alert : color }}
      >
        {value}
      </p>
      <p className="font-inter text-xs" style={{ color: COLORS.muted }}>
        {label}
      </p>
      {sub && (
        <p
          className="font-inter text-xs font-medium"
          style={{ color: alert ? COLORS.alert : color }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}