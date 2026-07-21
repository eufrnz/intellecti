package com.br.intellecti.controller;

import com.br.intellecti.config.springSecurity.JWTUserData;
import com.br.intellecti.dto.student.StudentResponseGetAllDTO;
import com.br.intellecti.dto.teacher.TeacherResponseGetMeDTO;
import com.br.intellecti.service.MeService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/me")
public class MeController {

    private final MeService meService;

    public MeController(MeService meService) {
        this.meService = meService;
    }

    @GetMapping("/teacher")
    public TeacherResponseGetMeDTO getTeacher(@AuthenticationPrincipal JWTUserData userData){
        if(userData == null){
            throw new RuntimeException("Have no person logged.");
        }
        String loggedUsername = userData.username();
        return meService.getTeacher(loggedUsername);
    }
    @GetMapping("/student")
    public StudentResponseGetAllDTO getMeStudent(@AuthenticationPrincipal JWTUserData userData){
        if(userData == null){
            throw new RuntimeException("Have no person logged.");
        }
        String loggedUsername = userData.username();
        return meService.getMeStudent(loggedUsername);
    }
}
