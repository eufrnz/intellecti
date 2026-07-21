export interface AssignmentStudentResponseDTO {
  id: string;
  studyPlanTitle: string;
  availableAt: string; // ISO date string (YYYY-MM-DD)
  dueDate: string;
  percentage: number;     // ISO date string (YYYY-MM-DD)
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