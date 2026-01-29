import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Role = "user" | "admin";

export type AuthUser = {
  _id: string;
  email: string;
  name?: string;
  role: Role;
};

type ThemeMode = "dark" | "light";

type AuthContextType = {
  token: string | null;
  user: AuthUser | null;

  // ✅ auth actions
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;

  // ✅ theme actions (THIS fixes your line 13 error)
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (t: ThemeMode) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  });

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("theme") as ThemeMode | null;
    return saved === "light" || saved === "dark" ? saved : "dark";
  });

  // keep html theme attribute updated (for CSS)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const setTheme = (t: ThemeMode) => setThemeState(t);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setAuth = (t: string, u: AuthUser) => {
    setToken(t);
    setUser(u);
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // theme ha tirtirin, user experience fiican
  };

  const value = useMemo<AuthContextType>(
    () => ({
      token,
      user,
      setAuth,
      logout,
      theme,
      toggleTheme,
      setTheme,
    }),
    [token, user, theme]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
