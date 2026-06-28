import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import type{ Role } from "../../../shared/types";
import { COLORS } from "../../../shared/constants/colors";

interface LoginScreenProps {
  onLogin: (role: Role) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState<Role>("producteur");

  const roles: { key: Role; label: string; sub: string }[] = [
    { key: "producteur", label: "Producteur", sub: "Portefeuille" },
    { key: "commercial", label: "Commercial", sub: "Pipeline" },
    { key: "promoteur", label: "Promoteur", sub: "Équipe" },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: `linear-gradient(160deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)` }}
    >
      <div className="flex flex-col items-center pt-14 pb-8 px-6">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <path
            d="M32 4 L60 32 L32 60 L4 32 Z"
            fill="rgba(255,255,255,0.15)"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
          />
          <path
            d="M32 12 L52 32 L32 52 L12 32 Z"
            fill="rgba(255,255,255,0.2)"
            stroke="white"
            strokeWidth="2"
          />
          <path d="M32 20 L44 32 L32 44 L20 32 Z" fill="white" />
        </svg>
        <h1 className="font-montserrat font-extrabold text-2xl mt-4" style={{ color: "#fff" }}>
          Assurance CRM
        </h1>
        <p className="font-inter text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>
          Votre portefeuille, partout avec vous
        </p>
      </div>

      <div
        className="flex-1 mx-4 mb-6 bg-white rounded-2xl p-6 flex flex-col gap-5"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
      >
        <div>
          <p className="font-inter text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: COLORS.muted }}>
            Profil
          </p>
          <div className="flex gap-2">
            {roles.map((r) => (
              <button
                key={r.key}
                onClick={() => setRole(r.key)}
                className="flex-1 rounded-xl py-2.5 px-2 text-center transition-all"
                style={{
                  background: role === r.key ? COLORS.primary : "#F0F2F5",
                  border: `2px solid ${role === r.key ? COLORS.primary : "transparent"}`,
                }}
              >
                <p
                  className="font-montserrat font-bold text-xs"
                  style={{ color: role === r.key ? "#fff" : COLORS.text }}
                >
                  {r.label}
                </p>
                <p
                  className="font-inter text-xs mt-0.5"
                  style={{ color: role === r.key ? "rgba(255,255,255,0.7)" : COLORS.muted }}
                >
                  {r.sub}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="font-inter text-sm font-medium block mb-1.5" style={{ color: COLORS.text }}>
            Téléphone / Email
          </label>
          <div
            className="flex items-center gap-2 rounded-xl px-3"
            style={{
              background: "#F0F2F5",
              border: `1.5px solid ${email ? COLORS.secondary : COLORS.border}`,
            }}
          >
            <Mail size={16} color={COLORS.muted} />
            <input
              className="font-inter flex-1 py-3 text-sm bg-transparent outline-none"
              style={{ color: COLORS.text }}
              placeholder="+225 07 __ __ __"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="font-inter text-sm font-medium block mb-1.5" style={{ color: COLORS.text }}>
            Mot de passe
          </label>
          <div
            className="flex items-center gap-2 rounded-xl px-3"
            style={{
              background: "#F0F2F5",
              border: `1.5px solid ${password ? COLORS.secondary : COLORS.border}`,
            }}
          >
            <Lock size={16} color={COLORS.muted} />
            <input
              className="font-inter flex-1 py-3 text-sm bg-transparent outline-none"
              style={{ color: COLORS.text }}
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={() => setShowPw(!showPw)}>
              {showPw ? <EyeOff size={16} color={COLORS.muted} /> : <Eye size={16} color={COLORS.muted} />}
            </button>
          </div>
        </div>

        <button
          className="font-montserrat font-bold text-base rounded-xl py-4 mt-1 active:opacity-90"
          style={{ background: COLORS.primary, color: "#fff" }}
          onClick={() => onLogin(role)}
        >
          Se connecter
        </button>
        <div className="text-center">
          <span className="font-inter text-xs" style={{ color: COLORS.muted }}>
            Mot de passe oublié ?{" "}
          </span>
          <span className="font-inter text-xs font-semibold" style={{ color: COLORS.secondary }}>
            Réinitialiser
          </span>
        </div>
      </div>
    </div>
  );
}