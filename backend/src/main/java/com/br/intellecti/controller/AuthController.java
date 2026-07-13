package com.br.intellecti.controller;

import com.br.intellecti.dto.login.LoginRequest;
import com.br.intellecti.dto.login.LoginResponse;
import com.br.intellecti.dto.register.student.StudentRequestDTO;
import com.br.intellecti.dto.register.student.StudentResponseDTO;
import com.br.intellecti.dto.register.teacher.TeacherRequestDTO;
import com.br.intellecti.dto.register.teacher.TeacherResponseDTO;
import com.br.intellecti.service.AuthService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest){
        return authService.login(loginRequest);
    }
    @PostMapping("/register/student")
    public StudentResponseDTO registerStudent(@RequestBody StudentRequestDTO studentRequestDTO){
        return authService.registerStudent(studentRequestDTO);
    }
    @PostMapping("/register/teacher")
    public TeacherResponseDTO registerTeacher(@RequestBody TeacherRequestDTO teacherRequestDTO){
        return authService.registerTeacher(teacherRequestDTO);
    }
}
