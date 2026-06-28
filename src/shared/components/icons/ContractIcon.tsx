import type { ReactNode } from "react";
import { Car, Heart, Building2, Plane, Briefcase, ShieldCheck, FileText } from "lucide-react";
import { COLORS } from "../../constants/colors";

interface ContractIconProps {
  type: string;
  size?: number;
}

export function ContractIcon({ type, size = 18 }: ContractIconProps) {
  const map: Record<string, { icon: ReactNode; color: string }> = {
    Auto: { icon: <Car size={size} />, color: "#3B82F6" },
    Santé: { icon: <Heart size={size} />, color: "#EC4899" },
    Habitation: { icon: <Building2 size={size} />, color: "#8B5CF6" },
    Voyage: { icon: <Plane size={size} />, color: "#06B6D4" },
    "RC Pro": { icon: <Briefcase size={size} />, color: COLORS.gold },
    Vie: { icon: <ShieldCheck size={size} />, color: COLORS.success },
  };
  const c = map[type] ?? { icon: <FileText size={size} />, color: COLORS.muted };
  return <span style={{ color: c.color }}>{c.icon}</span>;
}