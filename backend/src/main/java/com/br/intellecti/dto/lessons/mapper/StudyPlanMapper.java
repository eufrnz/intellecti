package com.br.intellecti.dto.lessons.mapper;

import com.br.intellecti.dto.lessons.response.*;
import com.br.intellecti.models.lessons.Contents;
import com.br.intellecti.models.lessons.Days;
import com.br.intellecti.models.lessons.StudyPlans;
import org.springframework.stereotype.Component;

@Component
public class StudyPlanMapper {

    public StudyPlanResponseDTO toDTO(StudyPlans studyPlan) {

        return new StudyPlanResponseDTO(
                studyPlan.getId(),
                studyPlan.getTitle(),
                studyPlan.getDescription(),
                studyPlan.getStudyPlanStatus(),
                studyPlan.getCreatedAt(),
                studyPlan.getUpdatedAt(),
                new TeacherSimpleDTO(
                        studyPlan.getTeacher().getId(),
                        studyPlan.getTeacher().getUser().getUsername(),
                        studyPlan.getTeacher().getUser().getEmail()
                ),
                studyPlan.getDays()
                        .stream()
                        .map(this::toDayDTO)
                        .toList()
        );
    }

    private DayResponseDTO toDayDTO(Days day) {
        return new DayResponseDTO(
                day.getId(),
                day.getNumber(),
                day.getTitle(),
                day.getDescription(),
                day.getContents().stream()
                        .map(this::toContentDTO)
                        .toList()
        );
    }

    private ContentResponseDTO toContentDTO(Contents content) {
        return new ContentResponseDTO(
                content.getId(),
                content.getTitle(),
                content.getContent(),
                content.getOrderIndex(),
                content.getQuestion() == null
                        ? null
                        : new QuestionResponseDTO(
                        content.getQuestion().getId(),
                        content.getQuestion().getCorrectAnswer(),
                        content.getQuestion().getExplanation(),
                        content.getQuestion().getPoints()
                )
        );
    }
}