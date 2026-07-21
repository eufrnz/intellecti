package com.br.intellecti.dto.assignment.withStudents.mapper;

import com.br.intellecti.dto.assignment.withStudents.response.AssignmentResponseDTO;
import com.br.intellecti.models.lessons.Assignment;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AssignmentMapper {
    public AssignmentResponseDTO toDTO(Assignment assignment){
        List<String> studentIds = assignment.getStudents().stream()
                .map(assignmentStudent -> assignmentStudent.getStudent().getId().toString())
                .toList();
        return new AssignmentResponseDTO(
                assignment.getStudyPlan().getTitle(),
                assignment.getAvailableAt(),
                assignment.getDueDate(),
                studentIds
        );
    }
}
