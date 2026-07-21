package com.br.intellecti.dto.assignment;

import com.br.intellecti.dto.lessons.response.StudyPlanResponseDTO;
import com.br.intellecti.models.lessons.AssignmentStudent;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record AssignmentResponseDTO(
        String studyPlanTitle,
        LocalDate availableAt,
        LocalDate dueDate,
        List<String> studentsId
) {
}
