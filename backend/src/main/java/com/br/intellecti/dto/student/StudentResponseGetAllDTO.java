package com.br.intellecti.dto.student;


import java.util.UUID;

public record StudentResponseGetAllDTO(
        UUID id,
        String username
) {
}
