package com.br.intellecti.dto.lessons.response;

import java.util.UUID;

public record QuestionResponseDTO(
        UUID id,
        String correctAnswer,
        String explanation,
        Integer points
) {
}