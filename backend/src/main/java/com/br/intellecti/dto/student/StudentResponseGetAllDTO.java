package com.br.intellecti.dto.student;


import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

public record StudentResponseGetAllDTO(
        UUID id,
        String username,
        Integer streak,
        String email,
        Set<LocalDate> loggedDays
) {
}
