export interface AuthState {
  role: "producteur" | "commercial" | "promoteur" | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}