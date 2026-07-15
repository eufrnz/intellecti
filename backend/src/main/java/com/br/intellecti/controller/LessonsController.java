package com.br.intellecti.controller;

import com.br.intellecti.config.springSecurity.JWTUserData;
import com.br.intellecti.dto.lessons.request.ContentRequestDTO;
import com.br.intellecti.dto.lessons.request.DayRequestDTO;
import com.br.intellecti.dto.lessons.request.StudyPlanRequestDTO;
import com.br.intellecti.dto.lessons.response.StudyPlanResponseDTO;
import com.br.intellecti.service.LessonsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lessons")
public class LessonsController {

    private final LessonsService studyPlanService;

    public LessonsController(LessonsService studyPlanService) {
        this.studyPlanService = studyPlanService;
    }

    @PostMapping("/createStudyPlan")
    public ResponseEntity<UUID> createStudyPlan(@RequestBody StudyPlanRequestDTO studyPlanRequestDTO, @AuthenticationPrincipal JWTUserData userData){
        if(userData == null) {
            throw new RuntimeException("User not found.");
        }
        String teacherLogged = userData.username();

        return ResponseEntity.ok(studyPlanService.createStudyPlan(studyPlanRequestDTO, teacherLogged));
    }

    @PostMapping("/study-plan/{studyPlanId}/add-day")
    public ResponseEntity<UUID> addDay(@PathVariable UUID studyPlanId , @RequestBody DayRequestDTO dayRequestDTO){
       return ResponseEntity.ok(studyPlanService.addDay(studyPlanId, dayRequestDTO));
    }
    @PostMapping("/study-plan/{dayId}/add-content")
    public void addContent(@PathVariable UUID dayId , @RequestBody ContentRequestDTO contentRequestDTO){
       studyPlanService.addContent(dayId, contentRequestDTO);
    }
    @PatchMapping("/study-plan/{studyPlanId}/publish")
    public ResponseEntity<UUID> publishStudyPlan(@PathVariable UUID studyPlanId){
        return ResponseEntity.ok(studyPlanService.publishStudyPlan(studyPlanId));
    }

    @GetMapping("/get-all-study-plans")
    public List<StudyPlanResponseDTO> getAllStudyPlans(){
        return  studyPlanService.getAllStudyPlans();
    }
    @GetMapping("/get-study-plans-by-id/{studyPlanId}")
    public StudyPlanResponseDTO getStudyPlansById(@PathVariable UUID studyPlanId){
        return studyPlanService.getStudyPlansById(studyPlanId);
    }

    @GetMapping("/count-my-lessons")
    public int countStudyPlans(@AuthenticationPrincipal JWTUserData userData){
        if(userData == null){
            throw new RuntimeException("User not found.");
        }
        String teacherLogged = userData.username();
        return studyPlanService.countStudyPlans(teacherLogged);
    }
}
