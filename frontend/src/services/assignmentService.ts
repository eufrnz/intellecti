import { API_BASE_URL } from './api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface AssignmentRequest {
  studyPlanId: string;
  availableAt: string;
  dueDate: string;
  students: string[];
}

export interface AssignmentResponse{
    studyPlanTitle: string;
    availableAt: string;
    dueDate: string;
    studentsId: string[];
}

export interface StudentResponse {
  id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
}

export async function createAssignment(payload: AssignmentRequest): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/assignment/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  console.log(payload);


  if (!response.ok) {
    const errorData = await response.text().catch(() => '');
    throw new Error(errorData || 'Não foi possível criar a assignment.');
  }

  const text = await response.text();
  return text.replace(/"/g, '');
}

export async function fetchAllStudents(): Promise<StudentResponse[]> {
  const response = await fetch(`${API_BASE_URL}/student/get-all`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Não foi possível carregar os estudantes.');
  }

  return response.json();
}

export async function fetchAssignments(): Promise<AssignmentResponse[]> {
  const response = await fetch(`${API_BASE_URL}/assignment/get-all`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Não foi possível carregar as assignments.');
  }
  return response.json();
}
