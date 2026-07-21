package com.br.intellecti.service;

import com.br.intellecti.dto.student.StudentResponseGetAllDTO;
import com.br.intellecti.dto.student.mapper.StudentMapper;
import com.br.intellecti.dto.teacher.TeacherResponseGetMeDTO;
import com.br.intellecti.dto.teacher.mapper.TeacherMapper;
import com.br.intellecti.models.users.Student;
import com.br.intellecti.models.users.Teacher;
import com.br.intellecti.repository.StudentRepository;
import com.br.intellecti.repository.TeacherRepository;
import org.springframework.stereotype.Service;

@Service
public class MeService {

    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;
    private final TeacherRepository teacherRepository;
    private final TeacherMapper teacherMapper;

    public MeService(StudentRepository studentRepository, StudentMapper studentMapper, TeacherRepository teacherRepository, TeacherMapper teacherMapper) {
        this.studentRepository = studentRepository;
        this.studentMapper = studentMapper;
        this.teacherRepository = teacherRepository;
        this.teacherMapper = teacherMapper;
    }

    public StudentResponseGetAllDTO getMeStudent(String username){
        Student student = studentRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Student not found."));
        return studentMapper.toDTO(student);
    }
    public TeacherResponseGetMeDTO getTeacher(String username){
        Teacher teacher = teacherRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Teacher not found."));
        return teacherMapper.toDTO(teacher);
    }

}
