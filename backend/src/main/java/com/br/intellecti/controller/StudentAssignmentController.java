package com.br.intellecti.controller;

import com.br.intellecti.config.springSecurity.JWTUserData;
import com.br.intellecti.dto.assignment.withoutStudents.response.AssignmentStudentResponseDTO;
import com.br.intellecti.service.AssignmentService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/student-assignment")
public class StudentAssignmentController {

    private final AssignmentService assignmentService;

    public StudentAssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @GetMapping("/get-my-assignment")
    public List<AssignmentStudentResponseDTO> studentAssignment(@AuthenticationPrincipal JWTUserData userData){
        if(userData == null){
            throw new RuntimeException("Have no person logged.");
        }
        String loggedUsername = userData.username();
        return assignmentService.studentAssignment(loggedUsername);
    }
}
