function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface StudentRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface StudentResponse {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

import { AUTH_BASE_URL } from './api';

export async function registerStudent(studentData: StudentRequest): Promise<void> {
  const response = await fetch(`${AUTH_BASE_URL}/register/student`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(studentData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Tente novamente.");
  }
}

export async function getAllStudent(): Promise<StudentResponse[]> {
    const response = await fetch("http://localhost:8080/api/student/get-all", {
       method: "GET",
       headers: getAuthHeaders()
    })
  if (!response.ok) {
    throw new Error("Não foi possível contar os students plans.");
  }

  return response.json();
  }