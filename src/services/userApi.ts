import api from "@/lib/api";

export type TokenResponse = { access_token: string; token_type: string };

export async function loginUser(username: string, password: string): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>("/auth/login", { username, password });
  return data;
}

export async function registerUser(username: string, email: string, password: string): Promise<{ message: string; user_id: number }> {
  const { data } = await api.post("/auth/register", { username, email, password });
  return data;
}

export async function googleSignIn(id_token: string): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>("/auth/google", { id_token });
  return data;
}

export async function logoutUser(): Promise<{ message: string }> {
  const { data } = await api.post("/auth/logout");
  return data;
}

export type DecodedUser = {
  id: number;
  username: string | null;
  email?: string | null;
  role?: string | null;
};

export function decodeJwt(token: string): any {
  try {
    const [, payload] = token.split(".");
    const json = atob(payload);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

