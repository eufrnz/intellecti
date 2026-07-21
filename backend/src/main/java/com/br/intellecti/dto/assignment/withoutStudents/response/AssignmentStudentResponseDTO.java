package com.br.intellecti.dto.assignment.withoutStudents.response;

import java.time.LocalDate;
import java.util.UUID;

public record AssignmentStudentResponseDTO(
        UUID id,
        String studyPlanTitle,
        LocalDate availableAt,
        LocalDate dueDate
) {
}
