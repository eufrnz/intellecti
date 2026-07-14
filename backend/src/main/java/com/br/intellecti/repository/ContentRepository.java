package com.br.intellecti.repository;

import com.br.intellecti.models.lessons.Contents;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ContentRepository extends JpaRepository<Contents, UUID> {
}
