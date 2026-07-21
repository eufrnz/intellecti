package com.br.intellecti.dto.assignment;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record AssignmentRequestDTO(

        UUID studyPlanId,
        @JsonFormat(pattern = "dd/MM/yyyy")
        LocalDate availableAt,
        @JsonFormat(pattern = "dd/MM/yyyy")
        LocalDate dueDate,
        List<UUID> students

) {
}