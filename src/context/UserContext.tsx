import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { decodeJwt, googleSignIn, loginUser, registerUser, logoutUser } from "../services/userApi";

type User = {
  id: number | null;
  username: string | null;
  role?: string | null;
  profile_url?: string | null;
  email?: string | null;
};

type UserContextType = {
  token: string | null;
  user: User | null;
  setToken: (t: string | null) => void;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: (credential: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("auth_token");
      if (stored) {
        setTokenState(stored);
        const decoded = decodeJwt(stored);
        setUser({ id: decoded?.id ?? null, username: decoded?.sub ?? null, role: decoded?.role ?? null, email: decoded?.email ?? null });
      }
    } catch {}
  }, []);

  const setToken = useCallback((t: string | null) => {
    setTokenState(t);
    try {
      if (t) localStorage.setItem("auth_token", t);
      else localStorage.removeItem("auth_token");
    } catch {}
    if (t) {
      const decoded = decodeJwt(t);
      setUser({ id: decoded?.id ?? null, username: decoded?.sub ?? null, role: decoded?.role ?? null, email: decoded?.email ?? null });
    } else {
      setUser(null);
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await loginUser(username, password);
    setToken(res.access_token);
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    await registerUser(username, email, password);
    await login(username, password);
  }, [login]);

  const signInWithGoogle = useCallback(async (credential: string) => {
    const res = await googleSignIn(credential);
    setToken(res.access_token);
  }, []);

  const loginAsGuest = useCallback(() => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const exp = Math.floor(Date.now() / 1000) + 60 * 60;
    const payload = btoa(JSON.stringify({ sub: "guest", id: -1, role: "user", exp }));
    const signature = btoa("guest-signature");
    setToken(`${header}.${payload}.${signature}`);
  }, []);

  const logout = useCallback(async () => {
    try { await logoutUser(); } catch {}
    try { localStorage.clear(); } catch {}
    setToken(null);
  }, [setToken]);

  const value = useMemo(() => ({ token, user, setToken, login, register, signInWithGoogle, loginAsGuest, logout }), [token, user, setToken, login, register, signInWithGoogle, loginAsGuest, logout]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}

