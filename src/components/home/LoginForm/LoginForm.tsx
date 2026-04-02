import React, { useCallback, useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import Image from "next/image";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  isSignInWithEmailLink,
  signInWithEmailLink,
  fetchSignInMethodsForEmail,
  User,
} from "firebase/auth";
import { auth, googleProvider } from "../../../utils/firebase";

type LoginFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated?: (token: string) => void;
};

export default function LoginForm({ isOpen, onClose, onAuthenticated }: LoginFormProps) {
  const { login: loginCtx, register: registerCtx, signInWithGoogle: signInGoogleCtx, loginAsGuest: guestCtx, firebaseLogin: firebaseLoginCtx, firebaseRegister: firebaseRegisterCtx } =
    useUser();

  const [mode, setMode] = useState<"login" | "register" | "verify">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  // Validation errors
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Firebase validation: email must be valid format, password min 6 chars
  const validateEmail = (value: string) => {
    // Firebase requires valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validatePassword = (value: string) => {
    // Firebase requires minimum 6 characters
    return value.length >= 6;
  };

  const close = useCallback(() => {
    if (loading) return;
    setError(null);
    setEmail("");
    setPassword("");
    setEmailError(null);
    setPasswordError(null);
    setMode("login");
    setVerificationSent(false);
    onClose();
  }, [loading, onClose]);

  const handleAuthSuccess = useCallback(
    (token: string) => {
      onAuthenticated?.(token);
      close();
    },
    [close, onAuthenticated]
  );

  // Login with Firebase Email/Password
  const login = useCallback(async () => {
    setError(null);

    // Client-side validation
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    } else setEmailError(null);

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters");
      return;
    } else setPasswordError(null);

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        setError("Please verify your email before logging in. Check your inbox for the verification link.");
        setLoading(false);
        return;
      }
      
      // Send to backend to create/sync user
      await firebaseLoginCtx(email);
      handleAuthSuccess(localStorage.getItem("auth_token") || "");
    } catch (e: any) {
      console.error("Login error:", e);
      // Firebase error codes
      if (e.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (e.code === "auth/user-not-found") {
        setError("No account found with this email");
      } else if (e.code === "auth/wrong-password") {
        setError("Incorrect password");
      } else if (e.code === "auth/invalid-credential") {
        setError("Invalid email or password");
      } else {
        setError(e.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, [email, password, loginCtx, handleAuthSuccess]);

  // Register with Firebase Email/Password + Email Verification
  const register = useCallback(async () => {
    setError(null);

    // Client-side validation - Firebase requirements
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    } else setEmailError(null);

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters");
      return;
    } else setPasswordError(null);

    setLoading(true);
    try {
      // First check if user already exists
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        setError("An account with this email already exists. Please login instead.");
        setMode("login");
        setLoading(false);
        return;
      }

      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // Send email verification
      await sendEmailVerification(userCredential.user);
      setVerificationSent(true);
      setMode("verify");
      
      // Store temp data for verification
      localStorage.setItem("pending_verification_email", email);
      localStorage.setItem("pending_verification_idToken", idToken);
      
    } catch (e: any) {
      console.error("Register error:", e);
      if (e.code === "auth/email-already-in-use") {
        setError("An account with this email already exists. Please login instead.");
        setMode("login");
      } else if (e.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (e.code === "auth/weak-password") {
        setError("Password should be at least 6 characters");
      } else {
        setError(e.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, [email, password]);

  // Verify email link clicked
  const verifyEmail = useCallback(async () => {
    setError(null);
    setLoading(true);
    
    try {
      // Check if we're on a page with the email link
      if (isSignInWithEmailLink(auth, window.location.href)) {
        const email = localStorage.getItem("pending_verification_email");
        if (!email) {
          setError("Verification session expired. Please register again.");
          setMode("register");
          setLoading(false);
          return;
        }
        
        // Complete sign in with email link
        const result = await signInWithEmailLink(auth, email, window.location.href);
        const idToken = await result.user.getIdToken();
        
        // Send to backend to create user
        await firebaseRegisterCtx(email);
        
        // Clear pending verification
        localStorage.removeItem("pending_verification_email");
        localStorage.removeItem("pending_verification_idToken");
        
        handleAuthSuccess(localStorage.getItem("auth_token") || "");
      } else {
        setError("Invalid verification link");
      }
    } catch (e: any) {
      console.error("Verification error:", e);
      setError(e.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  }, [firebaseRegisterCtx, handleAuthSuccess]);

  // Google Sign In with Firebase
  const signInWithGoogle = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userEmail = result.user.email;
      
      if (!userEmail) {
        setError("Could not get email from Google account");
        setLoading(false);
        return;
      }
      
      // Send email to backend
      await signInGoogleCtx(userEmail);
      handleAuthSuccess(localStorage.getItem("auth_token") || "");
    } catch (e: any) {
      console.error("Google sign in error:", e);
      if (e.code === "auth/popup-closed-by-user") {
        setError("Sign in was cancelled. Please try again.");
      } else if (e.code === "auth/account-exists-with-different-credential") {
        setError("An account already exists with a different sign in method. Please use that method.");
      } else {
        setError(e.message || "Google sign in failed");
      }
    } finally {
      setLoading(false);
    }
  }, [signInGoogleCtx, handleAuthSuccess]);

  const continueAsGuest = useCallback(async () => {
    guestCtx();
    handleAuthSuccess(localStorage.getItem("auth_token") || "");
  }, [guestCtx, handleAuthSuccess]);

  const resendVerification = useCallback(async () => {
    setLoading(true);
    try {
      const email = localStorage.getItem("pending_verification_email");
      if (email) {
        // Need to re-authenticate to send new verification
        // For simplicity, we'll just show a message
        setError("Please check your email for the verification link. If not received, try registering again.");
      }
    } catch (e: any) {
      setError(e.message || "Failed to resend verification");
    } finally {
      setLoading(false);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={close} />
      <div className="relative w-full max-w-md rounded-2xl bg-neutral-900 text-white shadow-2xl border border-white/10 m-4">
        {/* Verification Success View */}
        {mode === "verify" ? (
          <div className="px-6 py-8 text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Verification Email Sent!</h3>
                <p className="text-gray-400 text-sm">
                  We've sent a verification email to <span className="text-white">{email}</span>
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Please check your inbox and click the verification link to complete registration.
                </p>
              </div>
              
              {verificationSent && (
                <div className="text-sm text-blue-400 bg-blue-500/10 rounded-lg px-4 py-3 mb-4">
                  Verification email sent! Click the link in the email to verify your account.
                </div>
              )}
              
              <button
                onClick={resendVerification}
                disabled={loading}
                className="w-full mb-3 rounded-full py-2.5 bg-white/10 hover:bg-white/15"
              >
                {loading ? "Please wait..." : "Resend verification email"}
              </button>
              
              <button
                onClick={() => {
                  localStorage.removeItem("pending_verification_email");
                  localStorage.removeItem("pending_verification_idToken");
                  setMode("login");
                  setVerificationSent(false);
                }}
                className="w-full rounded-full py-2.5 text-gray-400 hover:text-white"
              >
                Back to Login
              </button>
            </div>
          ) : (
            /* Normal Login/Register View */
            <>
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
                  {mode === "register" && (
                    <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
                  )}
                </div>

                <button
                  onClick={mode === "login" ? login : register}
                  disabled={loading || !email || !password}
                  className="w-full mt-2 rounded-full py-2.5 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 transition-colors disabled:opacity-50"
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
                    disabled={loading}
                    className="w-full rounded-full bg-white text-black flex items-center justify-center gap-2 py-2.5 hover:bg-white/90 disabled:opacity-50"
                  >
                    <Image src={"/Google.png"} alt="g" width={20} height={20} />
                    Sign in with Google
                  </button>
                  <button
                    onClick={continueAsGuest}
                    disabled={loading}
                    className="w-full rounded-full bg-white/10 text-white py-2.5 hover:bg-white/15 disabled:opacity-50"
                  >
                    Continue as guest
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
    </div>
  );
}
