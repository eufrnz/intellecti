package com.br.intellecti.dto.assignment;

import com.br.intellecti.dto.lessons.response.*;
import com.br.intellecti.models.lessons.AssignmentStudent;
import org.springframework.stereotype.Component;

@Component
public class OpenedAssignmentMapper {
    public OpenedStudyPlanResponseDTO toDTO(AssignmentStudent assignmentStudent){
        return new OpenedStudyPlanResponseDTO(
                new StudyPlanResponseDTO(
                        assignmentStudent.getAssignment().getStudyPlan().getId(),
                        assignmentStudent.getAssignment().getStudyPlan().getTitle(),
                        assignmentStudent.getAssignment().getStudyPlan().getDescription(),
                        assignmentStudent.getAssignment().getStudyPlan().getStudyPlanStatus(),
                        assignmentStudent.getAssignment().getStudyPlan().getCreatedAt(),
                        assignmentStudent.getAssignment().getStudyPlan().getUpdatedAt(),
                        new TeacherSimpleDTO(
                                assignmentStudent.getAssignment().getStudyPlan().getTeacher().getId(),
                                assignmentStudent.getAssignment().getStudyPlan().getTeacher().getUser().getUsername(),
                                assignmentStudent.getAssignment().getStudyPlan().getTeacher().getUser().getEmail()
                        ),
                        assignmentStudent.getAssignment().getStudyPlan().getDays()
                                .stream()
                                .map(day -> new DayResponseDTO(
                                        day.getId(),
                                        day.getNumber(),
                                        day.getTitle(),
                                        day.getDescription(),
                                        day.getContents()
                                                .stream()
                                                .map(content -> new ContentResponseDTO(
                                                        content.getId(),
                                                        content.getTitle(),
                                                        content.getContent(),
                                                        content.getOrderIndex()
                                                ))
                                                .toList()
                                ))
                                .toList()
                )
        );
    }
}
