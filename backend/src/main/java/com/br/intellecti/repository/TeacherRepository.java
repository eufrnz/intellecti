package com.br.intellecti.repository;

import com.br.intellecti.models.users.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TeacherRepository extends JpaRepository<Teacher, UUID> {

    Optional<Teacher> findByUserUsername(String username);
}
