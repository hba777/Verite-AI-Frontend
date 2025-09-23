import React, { useCallback, useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import Image from "next/image";

type LoginFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated?: (token: string) => void;
};

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if ((window as any).google?.accounts?.id) return resolve();
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google script"));
    document.head.appendChild(script);
  });
}

export default function LoginForm({ isOpen, onClose, onAuthenticated }: LoginFormProps) {
  const { login: loginCtx, register: registerCtx, signInWithGoogle: signInGoogleCtx, loginAsGuest: guestCtx } =
    useUser();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validation errors
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && GOOGLE_CLIENT_ID) {
      loadGoogleScript()
        .then(() => {
          const google = (window as any).google;
          try {
            google.accounts.id.initialize({
              client_id: GOOGLE_CLIENT_ID,
              callback: async (response: any) => {
                if (!response?.credential) return;
                try {
                  await signInGoogleCtx(response.credential);
                  handleAuthSuccess(localStorage.getItem("auth_token") || "");
                } catch {}
              },
              ux_mode: "popup",
              auto_select: false,
            });
            google.accounts.id.prompt(() => {});
            const hidden = document.getElementById("google-btn-hidden");
            if (hidden && hidden.childElementCount === 0) {
              google.accounts.id.renderButton(hidden, {
                type: "standard",
                theme: "outline",
                size: "large",
                text: "continue_with",
                shape: "pill",
              });
            }
          } catch {}
        })
        .catch(() => {});
    }
  }, [isOpen]);

  const close = useCallback(() => {
    if (loading) return;
    setError(null);
    setEmail("");
    setPassword("");
    setEmailError(null);
    setPasswordError(null);
    setMode("login");
    onClose();
  }, [loading, onClose]);

  const handleAuthSuccess = useCallback(
    (token: string) => {
      onAuthenticated?.(token);
      close();
    },
    [close, onAuthenticated]
  );

  // simple email validation
  const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

  const login = useCallback(async () => {
    setError(null);

    // Client-side validation
    if (!validateEmail(email)) {
      setEmailError("Enter a valid email address");
      return;
    } else setEmailError(null);

    if (password.length < 4) {
      setPasswordError("Password must be at least 4 characters");
      return;
    } else setPasswordError(null);

    setLoading(true);
    try {
      await loginCtx(email, password);
      handleAuthSuccess(localStorage.getItem("auth_token") || "");
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [email, password, loginCtx, handleAuthSuccess]);

  const register = useCallback(async () => {
    setError(null);

    // Client-side validation
    if (!validateEmail(email)) {
      setEmailError("Enter a valid email address");
      return;
    } else setEmailError(null);

    if (password.length < 4) {
      setPasswordError("Password must be at least 4 characters");
      return;
    } else setPasswordError(null);

    setLoading(true);
    try {
      console.log("Registering user:", { email, password });
      await registerCtx(email, email, password);
      handleAuthSuccess(localStorage.getItem("auth_token") || "");
    } catch (e: any) {
      // Backend error handling
      if (e?.response?.status === 400) {
        setError("Email already exists. Please use another email.");
      } else {
        setError(e.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, [email, password, registerCtx, handleAuthSuccess]);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    if (!GOOGLE_CLIENT_ID) {
      setError("Google Sign-In not configured");
      return;
    }
    try {
      await loadGoogleScript();
      const google = (window as any).google;
      try {
        google.accounts.id.cancel();
      } catch {}
      try {
        google.accounts.id.disableAutoSelect();
      } catch {}
      const hidden = document.getElementById("google-btn-hidden");
      const btn = hidden?.querySelector('[role="button"]') as HTMLElement | null;
      if (btn) btn.click();
    } catch (e: any) {
      setError(e.message || "Google sign-in failed");
    }
  }, []);

  const continueAsGuest = useCallback(async () => {
    guestCtx();
    handleAuthSuccess(localStorage.getItem("auth_token") || "");
  }, [guestCtx, handleAuthSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000]">
      <div className="absolute inset-0 bg-black/60" onClick={close} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-neutral-900 text-white shadow-2xl border border-white/10">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex gap-2 text-sm">
              <button
                className={`px-3 py-1 rounded-full ${mode === "login" ? "bg-white text-black" : "bg-white/10"}`}
                onClick={() => setMode("login")}
                disabled={loading}
              >
                Login
              </button>
              <button
                className={`px-3 py-1 rounded-full ${mode === "register" ? "bg-white text-black" : "bg-white/10"}`}
                onClick={() => setMode("register")}
                disabled={loading}
              >
                Register
              </button>
            </div>
            <button className="text-white/70 hover:text-white" onClick={close} aria-label="Close">
              ✕
            </button>
          </div>

          <div className="px-6 py-5 space-y-4 text-left">
            {error && (
              <div className="text-red-400 text-sm bg-red-950/40 border border-red-700/40 rounded-md px-3 py-2">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-sm text-white/80">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 outline-none focus:border-white/30"
                placeholder="you@example.com"
                disabled={loading}
              />
              {emailError && <p className="text-red-400 text-xs">{emailError}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm text-white/80">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 outline-none focus:border-white/30"
                placeholder="••••••••"
                disabled={loading}
              />
              {passwordError && <p className="text-red-400 text-xs">{passwordError}</p>}
            </div>

            <button
              onClick={mode === "login" ? login : register}
              disabled={loading || !email || !password}
              className="w-full mt-2 rounded-full py-2.5 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 transition-colors"
            >
              {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-white/60">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="space-y-3">
              <button
                onClick={signInWithGoogle}
                className="w-full rounded-full bg-white text-black flex items-center justify-center gap-2 py-2.5 hover:bg-white/90"
              >
                <Image src={"/Google.png"} alt="g" width={20} height={20} />
                Sign in with Google
              </button>
              <button
                onClick={continueAsGuest}
                className="w-full rounded-full bg-white/10 text-white py-2.5 hover:bg-white/15"
              >
                Continue as guest
              </button>
              <div id="google-btn-hidden" style={{ position: "absolute", left: -9999, top: -9999 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
