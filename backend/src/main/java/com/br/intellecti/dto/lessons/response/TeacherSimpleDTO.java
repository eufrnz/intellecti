package com.br.intellecti.dto.lessons.response;

import java.util.UUID;

public record TeacherSimpleDTO(
        UUID id,
        String username,
        String email
) {
}
