export interface StudentResponseGetAllDTO {
  id: string;
  username: string;
  streak: number;
  email: string;
  loggedDays?: string[] | number[]; // Pode vir como lista de datas "YYYY-MM-DD" ou números dos dias do mês
}

export interface TeacherResponseGetMeDTO {
  id: string;
  username: string;
  email: string;
}

const BASE_URL = "/api";

function getAuthHeaders(): HeadersInit {
  const rawToken = 
    localStorage.getItem("token") || 
    localStorage.getItem("jwt") || 
    localStorage.getItem("accessToken");

  const token = rawToken ? rawToken.replace(/^"(.*)"$/, '$1') : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token && token !== "undefined" && token !== "null") {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

export async function fetchStudentMe(): Promise<StudentResponseGetAllDTO> {
  const response = await fetch(`${BASE_URL}/me/student`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Sessão inválida ou expirada. Faça login novamente.");
    }
    const errorText = await response.text();
    throw new Error(errorText || "Falha ao carregar perfil do estudante.");
  }

  return response.json();
}

export async function fetchTeacherMe(): Promise<TeacherResponseGetMeDTO> {
  const response = await fetch(`${BASE_URL}/me/teacher`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Sessão inválida ou expirada. Faça login novamente.");
    }
    const errorText = await response.text();
    throw new Error(errorText || "Falha ao carregar perfil do professor.");
  }

  return response.json();
}