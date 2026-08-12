package com.br.intellecti.service;

import com.br.intellecti.dto.assignment.OpenedAssignmentMapper;
import com.br.intellecti.dto.assignment.OpenedStudyPlanResponseDTO;
import com.br.intellecti.models.lessons.AssignmentStudent;
import com.br.intellecti.models.lessons.Days;
import com.br.intellecti.repository.AssignmentStudentRepository;
import com.br.intellecti.repository.DaysRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class OpenAssignmentAndStudyPlan {

    private final AssignmentStudentRepository assignmentStudentRepository;
    private final OpenedAssignmentMapper openedAssignmentMapper;
    private final DaysRepository daysRepository;

    public OpenAssignmentAndStudyPlan(AssignmentStudentRepository assignmentStudentRepository, OpenedAssignmentMapper openedAssignmentMapper, DaysRepository daysRepository) {
        this.assignmentStudentRepository = assignmentStudentRepository;
        this.openedAssignmentMapper = openedAssignmentMapper;
        this.daysRepository = daysRepository;
    }

    public OpenedStudyPlanResponseDTO loadStudyPlan(UUID studyAssignmentId){
        return assignmentStudentRepository.findById(studyAssignmentId)
                .map(openedAssignmentMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Assignment not found."));
    }

//    public void updatePercentage(UUID studyAssignmentId, UUID dayId){
//        AssignmentStudent assignmentStudent = assignmentStudentRepository.findById(studyAssignmentId)
//                .orElseThrow(() -> new RuntimeException("Assignment not found."));
//        Days day = daysRepository.findById(dayId)
//                .orElseThrow(() -> new RuntimeException("day not found."));
//
//        if (!Boolean.TRUE.equals(day.getCompleted())) {
//            day.setCompleted(true);
//            daysRepository.save(day);
//        }
//
//        List<Days> totalDays = assignmentStudent.getAssignment().getStudyPlan().getDays();
//        long completedDays= totalDays.stream().filter(d -> Boolean.TRUE.equals(d.getCompleted()))
//                .count();
//
//        double percentage = totalDays.isEmpty()
//                ? 0
//                : (completedDays * 100.0) / totalDays.size();
//        assignmentStudent.setPercentage(percentage);
//        assignmentStudentRepository.save(assignmentStudent);
//
//    }

}
