package com.br.intellecti.dto.lessons.response;

import java.util.UUID;

public record ContentResponseDTO(
        UUID id,
        String title,
        String content,
        Integer orderIndex) {
}