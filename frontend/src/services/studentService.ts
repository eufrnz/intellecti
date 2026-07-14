export interface StudentRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export async function registerStudent(studentData: StudentRequest): Promise<void> {
  const response = await fetch("http://localhost:8080/api/auth/register/student", {
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