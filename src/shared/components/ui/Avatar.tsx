import { initiales } from "../../utils/format";
import { COLORS } from "../../constants/colors";

interface AvatarProps {
  nom: string;
  prenom: string;
  size?: number;
  bg?: string;
}

export function Avatar({ nom, prenom, size = 40, bg = COLORS.primary }: AvatarProps) {
  return (
    <div
      className="font-montserrat font-bold flex items-center justify-center rounded-full flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: bg,
        color: "#fff",
        fontSize: size * 0.38,
      }}
    >
      {initiales(nom, prenom)}
    </div>
  );
}