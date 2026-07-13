package com.br.intellecti.config.springSecurity;

import java.util.UUID;

public record JWTUserData(
        UUID userId,
        String email,
        String role
) {
}
