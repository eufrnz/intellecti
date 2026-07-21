package com.br.intellecti.dto.teacher.mapper;

import com.br.intellecti.dto.teacher.TeacherResponseGetMeDTO;
import com.br.intellecti.models.users.Teacher;
import org.springframework.stereotype.Component;

@Component
public class TeacherMapper {
    public TeacherResponseGetMeDTO toDTO(Teacher teacher){
        return new TeacherResponseGetMeDTO(
                teacher.getId(),
                teacher.getUser().getUsername(),
                teacher.getUser().getEmail()
        );
    }
}
