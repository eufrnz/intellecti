package com.br.intellecti.dto.teacher;


import java.util.UUID;

public record TeacherResponseGetMeDTO(
        UUID id,
        String username,
        String email
) {
}
