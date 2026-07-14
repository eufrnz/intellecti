package com.br.intellecti.dto.lessons.request;

public record ContentRequestDTO(
        String title,
        String content,
        Integer orderIndex
) {
}
