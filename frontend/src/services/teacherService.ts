export interface TeacherRequest {
  username: string;
  email: string;
  password: string;
}

import { AUTH_BASE_URL } from './api';

export async function registerTeacher(teacherData: TeacherRequest): Promise<void> {
  const response = await fetch(`${AUTH_BASE_URL}/register/teacher`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(teacherData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Tente novamente.");
  }
}