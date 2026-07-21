package com.br.intellecti.dto.lessons.response;


import com.br.intellecti.models.enums.StudyPlanStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record StudyPlanResponseDTO(
        UUID id,
        String title,
        String description,
        StudyPlanStatus studyPlanStatus,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        TeacherSimpleDTO teacher,
        List<DayResponseDTO> days
) {
}
