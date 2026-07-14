export interface LoginRequest {
  username: string;
  password:  string;
}

export interface LoginResponse {
  username: string;
  token: string;
}

export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch("http://localhost:8080/api/auth/login", {
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