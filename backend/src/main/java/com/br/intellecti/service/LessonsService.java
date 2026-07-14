package com.br.intellecti.service;

import com.br.intellecti.dto.lessons.mapper.StudyPlanMapper;
import com.br.intellecti.dto.lessons.request.ContentRequestDTO;
import com.br.intellecti.dto.lessons.request.DayRequestDTO;
import com.br.intellecti.dto.lessons.request.StudyPlanRequestDTO;
import com.br.intellecti.dto.lessons.response.StudyPlanResponseDTO;
import com.br.intellecti.models.enums.StudyPlanStatus;
import com.br.intellecti.models.lessons.Contents;
import com.br.intellecti.models.lessons.Days;
import com.br.intellecti.models.lessons.StudyPlans;
import com.br.intellecti.models.users.Teacher;
import com.br.intellecti.repository.ContentRepository;
import com.br.intellecti.repository.DaysRepository;
import com.br.intellecti.repository.StudyPlanRepository;
import com.br.intellecti.repository.TeacherRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.UUID;

@Service
public class LessonsService {

    private final TeacherRepository teacherRepository;
    private final StudyPlanRepository studyPlanRepository;
    private final DaysRepository daysRepository;
    private final ContentRepository contentRepository;
    private final StudyPlanMapper studyPlanMapper;

    public LessonsService(TeacherRepository teacherRepository, StudyPlanRepository studyPlanRepository, ContentRepository contentRepository, DaysRepository daysRepository1, StudyPlanMapper studyPlanMapper) {
        this.teacherRepository = teacherRepository;
        this.studyPlanRepository = studyPlanRepository;
        this.contentRepository = contentRepository;
        this.daysRepository = daysRepository1;
        this.studyPlanMapper = studyPlanMapper;
    }

    public UUID createStudyPlan(StudyPlanRequestDTO studyPlanRequestDTO, String username){
        Teacher teacher = teacherRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        StudyPlans studyPlans = new StudyPlans();
        studyPlans.setTitle(studyPlanRequestDTO.title());
        studyPlans.setDescription(studyPlanRequestDTO.description());
        studyPlans.setStudyPlanStatus(studyPlanRequestDTO.studyPlanStatus());
        studyPlans.setTeacher(teacher);
        StudyPlans studyPlansSaved = studyPlanRepository.save(studyPlans);
        return studyPlansSaved.getId();
    }
    public UUID addDay(UUID studyPlanId, DayRequestDTO dayRequestDTO){
        StudyPlans studyPlan = studyPlanRepository.findById(studyPlanId)
                .orElseThrow(() -> new RuntimeException("Study plan not found."));
        Days day = new Days();
        day.setNumber(dayRequestDTO.number());
        day.setTitle(dayRequestDTO.title());
        day.setDescription(dayRequestDTO.description());
        day.setStudyPlan(studyPlan);
        Days savedDay = daysRepository.save(day);
        return savedDay.getId();
    }

    public void addContent(UUID dayId, ContentRequestDTO contentRequestDTO) {
        Days day = daysRepository.findById(dayId)
                .orElseThrow(() -> new RuntimeException("Day not found"));
        Contents contents = new Contents();
        contents.setTitle(contentRequestDTO.title());
        contents.setContent(contentRequestDTO.content());
        contents.setOrderIndex(contentRequestDTO.orderIndex());
        contents.setDay(day);
        contentRepository.save(contents);
    }

    public UUID publishStudyPlan(UUID studyPlanId){
        StudyPlans studyPlan = studyPlanRepository.findById(studyPlanId)
                .orElseThrow(() -> new RuntimeException("Study plan not found."));
        if(studyPlan.getStudyPlanStatus() == StudyPlanStatus.DRAFT ||
                studyPlan.getStudyPlanStatus() == StudyPlanStatus.ARCHIVED){
            studyPlan.setStudyPlanStatus(StudyPlanStatus.PUBLISHED);
            studyPlanRepository.save(studyPlan);
        }
        return studyPlan.getId();
    }

    public List<StudyPlanResponseDTO> getAllStudyPlans(){
       return studyPlanRepository.findAll()
               .stream()
               .map(studyPlanMapper::toDTO)
               .toList();

    }
    public StudyPlanResponseDTO getStudyPlansById(UUID studyPlanId){
       StudyPlans studyPlan = studyPlanRepository.findById(studyPlanId)
               .orElseThrow(() -> new RuntimeException("Study plan not found."));
       return studyPlanMapper.toDTO(studyPlan);
    }



}
