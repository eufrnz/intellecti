package com.br.intellecti.repository;

import com.br.intellecti.models.users.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface StudentRepository extends JpaRepository<Student, UUID> {
    Optional<Student> findByUserUsername(String username);
}
