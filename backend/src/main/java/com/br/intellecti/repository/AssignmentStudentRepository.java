package com.br.intellecti.repository;

import com.br.intellecti.models.lessons.AssignmentStudent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AssignmentStudentRepository extends JpaRepository<AssignmentStudent, UUID> {
    List<AssignmentStudent> findByStudentUserUsername(String username);
}
