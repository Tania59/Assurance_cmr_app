import { useState } from "react";
import type { Role } from "../../../shared/types";

export function useAuth() {
  const [role, setRole] = useState<Role | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (r: Role) => {
    setRole(r);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setRole(null);
    setIsAuthenticated(false);
  };

  return {
    role,
    isAuthenticated,
    login,
    logout,
  };
}