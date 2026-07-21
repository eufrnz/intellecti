import { LESSONS_BASE_URL } from './api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface StudyPlanRequest {
  title: string;
  description: string;
  studyPlanStatus: string;
}

export interface StudyPlanResponse {
  id: string;
  title?: string;
  description?: string;
  studyPlanStatus?: string;
  days?: Array<{
    id: string;
    title?: string;
    description?: string;
    content?: Array<{
      id: string;
      title?: string;
      content?: string;
      orderIndex?: number;
    }>;
  }>;
}

export interface DayRequest {
  number: number;
  title: string;
  description: string;
}

export interface ContentRequest {
  title: string;
  content: string;
  orderIndex: number;
}

export async function createStudyPlan(payload: StudyPlanRequest): Promise<string> {
  const response = await fetch(`${LESSONS_BASE_URL}/createStudyPlan`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.text().catch(() => "");
    throw new Error(errorData || "Não foi possível criar o estudo.");
  }

  const text = await response.text();
  return text.replace(/"/g, "");
}

export async function addDayToStudyPlan(studyPlanId: string, payload: DayRequest): Promise<string> {
  const response = await fetch(`${LESSONS_BASE_URL}/study-plan/${studyPlanId}/add-day`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.text().catch(() => "");
    throw new Error(errorData || "Não foi possível criar o dia do plano.");
  }

  const text = await response.text();
  return text.replace(/"/g, "");
}

export async function addContentToDay(dayId: string, payload: ContentRequest): Promise<void> {
  const response = await fetch(`${LESSONS_BASE_URL}/study-plan/${dayId}/add-content`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.text().catch(() => "");
    throw new Error(errorData || "Não foi possível adicionar conteúdo ao dia.");
  }
}

export async function fetchStudyPlans(): Promise<StudyPlanResponse[]> {
  const response = await fetch(`${LESSONS_BASE_URL}/get-all-study-plans`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Não foi possível carregar os study plans.");
  }

  return response.json();
}

export async function countMyStudyPlans(): Promise<number> {
  const response = await fetch(`${LESSONS_BASE_URL}/count-my-lessons`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Não foi possível contar os study plans.");
  }

  return response.json();
}

export async function deleteStudyPlan(studyPlanId: string): Promise<void> {
  const response = await fetch(`${LESSONS_BASE_URL}/delete/${studyPlanId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Erro ${response.status}: Não foi possível excluir o plano.`);
  }
}

