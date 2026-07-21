package com.br.intellecti.repository;

import com.br.intellecti.models.lessons.AssignmentStudent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AssignmentStudentRepository extends JpaRepository<AssignmentStudent, UUID> {
}
