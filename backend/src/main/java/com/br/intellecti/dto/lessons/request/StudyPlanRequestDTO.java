package com.br.intellecti.dto.lessons.request;

import com.br.intellecti.models.enums.StudyPlanStatus;

public record StudyPlanRequestDTO(
        String title,
        String description,
        StudyPlanStatus studyPlanStatus
) {
}
