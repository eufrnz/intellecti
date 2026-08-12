package com.br.intellecti.controller;

import com.br.intellecti.config.springSecurity.JWTUserData;
import com.br.intellecti.dto.assignment.OpenedStudyPlanResponseDTO;
import com.br.intellecti.dto.assignment.withStudents.request.AssignmentRequestDTO;
import com.br.intellecti.dto.assignment.withStudents.response.AssignmentResponseDTO;
import com.br.intellecti.service.AssignmentService;
import com.br.intellecti.service.OpenAssignmentAndStudyPlan;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/assignment")
public class AssignmentController {

    private final AssignmentService assignmentService;
    private final OpenAssignmentAndStudyPlan openAssignmentAndStudyPlan;

    public AssignmentController(AssignmentService assignmentService, OpenAssignmentAndStudyPlan openAssignmentAndStudyPlan) {
        this.assignmentService = assignmentService;
        this.openAssignmentAndStudyPlan = openAssignmentAndStudyPlan;
    }

    @PostMapping("/create")
    public ResponseEntity<UUID> createAssignment(@AuthenticationPrincipal JWTUserData userData,
                                                 @RequestBody AssignmentRequestDTO assignmentRequestDTO) {
        if (userData == null) {
            throw new RuntimeException("User not logged");
        }
        String teacherLogged = userData.username();
        return ResponseEntity.ok(assignmentService.createAssignment(teacherLogged, assignmentRequestDTO));
    }

    @GetMapping("/get-all")
    public List<AssignmentResponseDTO> getAllAssignments(@AuthenticationPrincipal JWTUserData userData) {
        if (userData == null) {
            throw new RuntimeException("User not logged");
        }
        String teacherLogged = userData.username();
        return assignmentService.getAllAssignments(teacherLogged);
    }

    @GetMapping("/open/{studyAssignmentId}")
    public OpenedStudyPlanResponseDTO loadStudyPlan(@PathVariable UUID studyAssignmentId) {
        return openAssignmentAndStudyPlan.loadStudyPlan(studyAssignmentId);
    }
}
