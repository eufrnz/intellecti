package com.br.intellecti.models.assignment;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record AssignmentRequestDTO(

        UUID studyPlanId,

        LocalDateTime availableAt,

        LocalDateTime dueDate,

        List<UUID> students

) {
}