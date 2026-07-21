package com.br.intellecti.service;

import com.br.intellecti.dto.student.StudentResponseGetAllDTO;
import com.br.intellecti.dto.student.mapper.StudentMapper;
import com.br.intellecti.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;

    public StudentService(StudentRepository studentRepository, StudentMapper studentMapper) {
        this.studentRepository = studentRepository;
        this.studentMapper = studentMapper;
    }

    public List<StudentResponseGetAllDTO> getStudents(){
        return studentRepository.findAll().stream()
                .map(studentMapper::toDTO).toList();
    }
}
