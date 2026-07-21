package com.br.intellecti.dto.student.mapper;

import com.br.intellecti.dto.student.StudentResponseGetAllDTO;
import com.br.intellecti.models.users.Student;
import org.springframework.stereotype.Component;

@Component
public class StudentMapper {

    public StudentResponseGetAllDTO toDTO(Student student){
        return new StudentResponseGetAllDTO(
                student.getId(),
                student.getUser().getUsername(),
                student.getStreak(),
                student.getUser().getEmail(),
                student.getLoggedDays()
        );
    }
}
