export interface AssignmentStudentResponseDTO {
  id: string;
  studyPlanTitle: string;
  availableAt: string; // ISO date string (YYYY-MM-DD)
  dueDate: string;
  percentage: number;
}

export interface ContentDTO {
  id: string;
  title: string;
  content: string;
  orderIndex: number;
}

export interface DayDTO {
  id: string;
  number: number;
  title: string;
  description: string;
  contents: ContentDTO[];
}

export interface TeacherDTO {
  id: string;
  username: string;
  email: string;
}

export interface StudyPlanResponseDTO {
  id: string;
  title: string;
  description: string;
  studyPlanStatus: string;
  createdAt: string;
  updatedAt: string;
  teacher: TeacherDTO;
  days: DayDTO[];
}

export interface OpenedStudyPlanResponseDTO {
  studyPlanResponseDTO: StudyPlanResponseDTO;
}

export async function fetchStudentAssignments(): Promise<AssignmentStudentResponseDTO[]> {
    const response = await fetch("/api/student-assignment/get-my-assignment",{
        method: "GET",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    if(!response.ok){
        throw new Error("Failed to fetch student assignments");
    }
    return response.json();
}

export async function fetchOpenedStudentAssignment(studyAssignmentId: string): Promise<OpenedStudyPlanResponseDTO> {
  const response = await fetch(`/api/assignment/open/${studyAssignmentId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Você não tem permissão para acessar esta tarefa ou sua sessão expirou.');
    }
    throw new Error('Não foi possível carregar os detalhes desta tarefa.');
  }

  return response.json();
}