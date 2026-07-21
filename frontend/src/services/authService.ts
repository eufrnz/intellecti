export interface LoginRequest {
  username: string;
  password:  string;
}

export interface LoginResponse {
  username: string;
  token: string;
}

import { AUTH_BASE_URL } from './api';

export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${AUTH_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Usuário ou senha incorretos.");
  }

  return response.json();
}