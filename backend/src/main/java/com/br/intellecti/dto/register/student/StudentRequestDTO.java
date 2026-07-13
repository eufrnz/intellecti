package com.br.intellecti.dto.register.student;

public record StudentRequestDTO(
        String firstName,
        String lastName,
        String email,
        String password,
        String username
) {
}
