package com.br.intellecti.dto.lessons.response;

import java.util.List;
import java.util.UUID;

public record DayResponseDTO(
        UUID id,
        Integer number,
        String title,
        String description,
        List<ContentResponseDTO> contents
) {
}