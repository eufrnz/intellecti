package com.br.intellecti.repository;

import com.br.intellecti.models.lessons.Days;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DaysRepository extends JpaRepository<Days, UUID> {
}
