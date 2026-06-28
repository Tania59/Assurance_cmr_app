import type { ReactNode } from "react";
import { COLORS } from "../../constants/colors";
import  type { Screen } from "../../types";

interface TabDef {
  key: Screen;
  icon: ReactNode;
  label: string;
}

interface BottomTabBarProps {
  tabs: TabDef[];
  active: Screen;
  navigate: (s: Screen) => void;
}

export function BottomTabBar({ tabs, active, navigate }: BottomTabBarProps) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 flex z-30"
      style={{
        background: "#fff",
        borderTop: `1px solid ${COLORS.border}`,
        boxShadow: "0 -2px 12px rgba(0,0,0,0.08)",
        paddingBottom: "env(safe-area-inset-bottom,0px)",
      }}
    >
      {tabs.map((t) => {
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5"
            style={{ color: isActive ? COLORS.primary : "#9CA3AF" }}
            onClick={() => navigate(t.key)}
          >
            <div style={{ color: isActive ? COLORS.primary : "#9CA3AF" }}>{t.icon}</div>
            <span style={{ fontSize: 10, fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
              {t.label}
            </span>
            {isActive && <span className="w-1 h-1 rounded-full" style={{ background: COLORS.primary }} />}
          </button>
        );
      })}
    </div>
  );
}