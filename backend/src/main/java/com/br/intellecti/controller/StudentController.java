package com.br.intellecti.controller;

import com.br.intellecti.dto.student.StudentResponseGetAllDTO;
import com.br.intellecti.service.StudentService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/get-all")
    public List<StudentResponseGetAllDTO> getStudents(){
        return studentService.getStudents();
    }

}
