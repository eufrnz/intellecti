package com.br.intellecti.service;

import com.br.intellecti.dto.assignment.withStudents.request.AssignmentRequestDTO;
import com.br.intellecti.dto.assignment.withStudents.response.AssignmentResponseDTO;
import com.br.intellecti.dto.assignment.withStudents.mapper.AssignmentMapper;
import com.br.intellecti.dto.assignment.withoutStudents.response.AssignmentStudentResponseDTO;
import com.br.intellecti.dto.assignment.withoutStudents.response.mapper.AssignmentStudentMapper;
import com.br.intellecti.models.enums.AssignmentStatus;
import com.br.intellecti.models.lessons.Assignment;
import com.br.intellecti.models.lessons.AssignmentStudent;
import com.br.intellecti.models.lessons.StudyPlans;
import com.br.intellecti.models.users.Student;
import com.br.intellecti.models.users.Teacher;
import com.br.intellecti.repository.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final TeacherRepository teacherRepository;
    private final StudyPlanRepository studyPlanRepository;
    private final StudentRepository studentRepository;
    private final AssignmentStudentRepository assignmentStudentRepository;
    private final AssignmentMapper assignmentMapper;
    private final AssignmentStudentMapper assignmentStudentMapper;


    public AssignmentService(AssignmentRepository assignmentRepository,
                             TeacherRepository teacherRepository,
                             StudyPlanRepository studyPlanRepository,
                             StudentRepository studentRepository,
                             AssignmentStudentRepository assignmentStudentRepository,
                             AssignmentMapper assignmentMapper,
                             AssignmentStudentMapper assignmentStudentMapper) {
        this.assignmentRepository = assignmentRepository;
        this.teacherRepository = teacherRepository;
        this.studyPlanRepository = studyPlanRepository;
        this.studentRepository = studentRepository;
        this.assignmentStudentRepository = assignmentStudentRepository;
        this.assignmentMapper = assignmentMapper;
        this.assignmentStudentMapper = assignmentStudentMapper;
    }

    public UUID createAssignment(String username, AssignmentRequestDTO assignmentRequestDTO){
            Teacher teacher = teacherRepository.findByUserUsername(username)
                    .orElseThrow(() -> new RuntimeException("Teacher not found."));
            StudyPlans studyPlan = studyPlanRepository.findById(assignmentRequestDTO.studyPlanId())
                    .orElseThrow(() -> new RuntimeException("Study plan not found."));
            Assignment assignment = new Assignment();
            assignment.setTeacher(teacher);
            assignment.setStudyPlan(studyPlan);
            assignment.setAvailableAt(assignmentRequestDTO.availableAt());
            assignment.setDueDate(assignmentRequestDTO.dueDate());
            assignment.setStatus(AssignmentStatus.PUBLISHED);
            assignmentRepository.save(assignment);

            for(UUID studentId : assignmentRequestDTO.students()){
                Student student = studentRepository.findById(studentId)
                        .orElseThrow();

                AssignmentStudent assignmentStudent = new AssignmentStudent();
                assignmentStudent.setAssignment(assignment);
                assignmentStudent.setStudent(student);
                assignmentStudent.setCompleted(false);
                assignmentStudent.setPercentage(0D);
                assignmentStudent.setCompleted(false);
                assignmentStudentRepository.save(assignmentStudent);
            }
            return assignment.getId();
        }

            public List<AssignmentResponseDTO> getAllAssignments(String username){
                return assignmentRepository.findByTeacherUserUsername(username).stream()
                        .map(assignmentMapper::toDTO)
                        .toList();
            }

            @Scheduled(cron = " 0 0 0 * * *")
            public void closeAssignment(){
                List<Assignment> assignment = assignmentRepository.findAll();

                for (Assignment assignment1 : assignment){
                    LocalDate closeDate = assignment1.getDueDate();
                    if(LocalDate.now().isAfter(closeDate)){
                        assignmentRepository.delete(assignment1);
                    }
                }
            }

            public List<AssignmentStudentResponseDTO> studentAssignment(String username){
                return assignmentStudentRepository.findByStudentUserUsername(username)
                        .stream()
                        .map(assignmentStudentMapper::toDTO)
                        .toList();
            }

    }
