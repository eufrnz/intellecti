package com.br.intellecti.repository;

import com.br.intellecti.models.lessons.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AssignmentRepository extends JpaRepository<Assignment, UUID> {
    List<Assignment> findByTeacherUserUsername(String username);

}
