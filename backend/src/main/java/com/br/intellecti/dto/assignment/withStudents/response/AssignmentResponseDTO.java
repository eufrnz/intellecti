package com.br.intellecti.dto.assignment.withStudents.response;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record AssignmentResponseDTO(
        UUID id,
        String studyPlanTitle,
        LocalDate availableAt,
        LocalDate dueDate,
        List<String> studentsId
) {
}
