package com.br.intellecti.service;

import com.br.intellecti.dto.student.StudentResponseGetAllDTO;
import com.br.intellecti.dto.student.mapper.StudentMapper;
import com.br.intellecti.models.users.Student;
import com.br.intellecti.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

    public void updateStudentStreak(String username){
        Student student = studentRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        LocalDate today = LocalDate.now();
        LocalDate lastLogin = student.getLastLoginDate();

        if(lastLogin == null){
            student.setLastLoginDate(today);
            student.setStreak(1);
            student.getLoggedDays().add(today);
            studentRepository.save(student);
            return;
        }
        if(lastLogin.equals(today)){
            return;
        }
        if(lastLogin.plusDays(1).equals(today)){
            student.setStreak(student.getStreak() + 1);
        }else{
            student.setStreak(1);
        }


        student.setLastLoginDate(today);
        student.getLoggedDays().add(today);
        studentRepository.save(student);
    }
}
