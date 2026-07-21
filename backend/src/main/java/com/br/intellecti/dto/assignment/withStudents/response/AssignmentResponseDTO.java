package com.br.intellecti.dto.assignment.withStudents.response;

import java.time.LocalDate;
import java.util.List;

public record AssignmentResponseDTO(
        String studyPlanTitle,
        LocalDate availableAt,
        LocalDate dueDate,
        List<String> studentsId
) {
}
