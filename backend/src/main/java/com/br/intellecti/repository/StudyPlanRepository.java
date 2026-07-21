package com.br.intellecti.repository;

import com.br.intellecti.models.lessons.StudyPlans;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface StudyPlanRepository extends JpaRepository<StudyPlans, UUID> {

    List<StudyPlans> findByTeacherUserUsername(String username);
}
