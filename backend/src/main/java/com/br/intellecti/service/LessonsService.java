package com.br.intellecti.service;

import com.br.intellecti.dto.lessons.mapper.StudyPlanMapper;
import com.br.intellecti.dto.lessons.request.ContentRequestDTO;
import com.br.intellecti.dto.lessons.request.DayRequestDTO;
import com.br.intellecti.dto.lessons.request.StudyPlanRequestDTO;
import com.br.intellecti.dto.lessons.response.StudyPlanResponseDTO;
import com.br.intellecti.models.enums.StudyPlanStatus;
import com.br.intellecti.models.lessons.Assignment;
import com.br.intellecti.models.lessons.Contents;
import com.br.intellecti.models.lessons.Days;
import com.br.intellecti.models.lessons.StudyPlans;
import com.br.intellecti.models.users.Teacher;
import com.br.intellecti.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class LessonsService {

    private final TeacherRepository teacherRepository;
    private final StudyPlanRepository studyPlanRepository;
    private final DaysRepository daysRepository;
    private final ContentRepository contentRepository;
    private final StudyPlanMapper studyPlanMapper;
    private final AssignmentRepository assignmentRepository;
    private final AssignmentService assignmentService;
    private final AssignmentStudentRepository assignmentStudentRepository;

    public LessonsService(TeacherRepository teacherRepository, StudyPlanRepository studyPlanRepository,
                          ContentRepository contentRepository, DaysRepository daysRepository,
                          StudyPlanMapper studyPlanMapper, AssignmentRepository assignmentRepository, AssignmentService assignmentService, AssignmentStudentRepository assignmentStudentRepository) {
        this.teacherRepository = teacherRepository;
        this.studyPlanRepository = studyPlanRepository;
        this.contentRepository = contentRepository;
        this.daysRepository = daysRepository;
        this.studyPlanMapper = studyPlanMapper;
        this.assignmentRepository = assignmentRepository;
        this.assignmentService = assignmentService;
        this.assignmentStudentRepository = assignmentStudentRepository;
    }

    public UUID createStudyPlan(StudyPlanRequestDTO studyPlanRequestDTO, String username){
        Teacher teacher = teacherRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        StudyPlans studyPlans = new StudyPlans();
        if(studyPlanRequestDTO.title() != null){
            studyPlans.setTitle(studyPlanRequestDTO.title());
        }else{
            throw new RuntimeException("Null input. Please write some text.");
        }
        if(studyPlanRequestDTO.description() != null){
            studyPlans.setDescription(studyPlanRequestDTO.description());
        }else{
            throw new RuntimeException("Null input. Please write some text.");
        }
        if(studyPlanRequestDTO.studyPlanStatus() != null){
            studyPlans.setStudyPlanStatus(studyPlanRequestDTO.studyPlanStatus());
        }else{
            throw new RuntimeException("Null input. Please write some text.");
        }
        studyPlans.setTeacher(teacher);
        StudyPlans studyPlansSaved = studyPlanRepository.save(studyPlans);
        return studyPlansSaved.getId();
    }
    public UUID addDay(UUID studyPlanId, DayRequestDTO dayRequestDTO){
        StudyPlans studyPlan = studyPlanRepository.findById(studyPlanId)
                .orElseThrow(() -> new RuntimeException("Study plan not found."));
        Days day = new Days();
        if(dayRequestDTO.number() != null){
            day.setNumber(dayRequestDTO.number());
        }else{
            throw new RuntimeException("Null input. Please write some text.");
        }
        if(dayRequestDTO.title() != null){
            day.setTitle(dayRequestDTO.title());
        }else{
            throw new RuntimeException("Null input. Please write some text.");
        }
        if(dayRequestDTO.description() != null){
            day.setDescription(dayRequestDTO.description());
        }else{
            throw new RuntimeException("Null input. Please write some text.");
        }
        day.setStudyPlan(studyPlan);
        Days savedDay = daysRepository.save(day);
        return savedDay.getId();
    }

    public void addContent(UUID dayId, ContentRequestDTO contentRequestDTO) {
        Days day = daysRepository.findById(dayId)
                .orElseThrow(() -> new RuntimeException("Day not found"));
        Contents contents = new Contents();
        if(contentRequestDTO.title() != null){
            contents.setTitle(contentRequestDTO.title());
        }else{
            throw new RuntimeException("Null input. Please write some text.");
        }
        if(contentRequestDTO.content() != null){
            contents.setContent(contentRequestDTO.content());
        }else{
            throw new RuntimeException("Null input. Please write some text.");
        }
        if(contentRequestDTO.orderIndex() != null){
            contents.setOrderIndex(contentRequestDTO.orderIndex());
        }else{
            throw new RuntimeException("Null input. Please write some text.");
        }
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

    public int countStudyPlans(String username){
        List<StudyPlans> studyPlan = studyPlanRepository.findByTeacherUserUsername(username);
        return studyPlan.size();
    }

    public List<StudyPlanResponseDTO> getAllMyStudyPlans(String username){
        return studyPlanRepository.findByTeacherUserUsername(username)
                .stream()
                .map(studyPlanMapper::toDTO)
                .toList();
    }

    @Transactional
    public void deleteStudyPlan(UUID studyPlanId) {
        List<Assignment> assignments = assignmentRepository.findByStudyPlanId(studyPlanId);
        if (!assignments.isEmpty()) {
            for (Assignment assignment : assignments) {
                assignmentStudentRepository.deleteAllByAssignmentId(assignment.getId());
            }
            assignmentRepository.deleteAll(assignments);
        }
        studyPlanRepository.deleteById(studyPlanId);
    }

}
