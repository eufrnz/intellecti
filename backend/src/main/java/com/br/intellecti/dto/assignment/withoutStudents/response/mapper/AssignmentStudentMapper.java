package com.br.intellecti.dto.assignment.withoutStudents.response.mapper;

import com.br.intellecti.dto.assignment.withStudents.response.AssignmentResponseDTO;
import com.br.intellecti.dto.assignment.withoutStudents.response.AssignmentStudentResponseDTO;
import com.br.intellecti.models.lessons.Assignment;
import com.br.intellecti.models.lessons.AssignmentStudent;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AssignmentStudentMapper {
    public AssignmentStudentResponseDTO toDTO(AssignmentStudent assignment){

        return new AssignmentStudentResponseDTO(
                assignment.getId(),
                assignment.getAssignment().getStudyPlan().getTitle(),
                assignment.getAssignment().getAvailableAt(),
                assignment.getAssignment().getDueDate(),
                assignment.getPercentage()
        );
    }
}
