package com.br.intellecti.service;

import com.br.intellecti.config.springSecurity.TokenService;
import com.br.intellecti.dto.login.LoginRequest;
import com.br.intellecti.dto.login.LoginResponse;
import com.br.intellecti.dto.register.student.StudentRequestDTO;
import com.br.intellecti.dto.register.student.StudentResponseDTO;
import com.br.intellecti.dto.register.teacher.TeacherRequestDTO;
import com.br.intellecti.dto.register.teacher.TeacherResponseDTO;
import com.br.intellecti.models.enums.Role;
import com.br.intellecti.models.users.Student;
import com.br.intellecti.models.users.Teacher;
import com.br.intellecti.models.users.User;
import com.br.intellecti.repository.StudentRepository;
import com.br.intellecti.repository.TeacherRepository;
import com.br.intellecti.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TeacherRepository teacherRepository;
    private final StudentService studentService;

    public AuthService(AuthenticationManager authenticationManager, TokenService tokenService, StudentRepository studentRepository, UserRepository userRepository, PasswordEncoder passwordEncoder, TeacherRepository teacherRepository, StudentService studentService) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.teacherRepository = teacherRepository;
        this.studentService = studentService;
    }

    public LoginResponse login(LoginRequest loginRequest){
        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.username(),
                        loginRequest.password()
                )
        );
        User user = (User) authentication.getPrincipal();
        String token = tokenService.generateToken(user);
        if(user.getRole() == Role.ROLE_STUDENT){
            studentService.updateStudentStreak(user.getUsername());
        }
        return new LoginResponse(
                user.getUsername(),
                token
        );
    }

    public StudentResponseDTO registerStudent(StudentRequestDTO studentRequestDTO){
        if(userRepository.findByEmail(studentRequestDTO.email()).isPresent()){
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        if(studentRequestDTO.email() != null){
            user.setEmail(studentRequestDTO.email());
        }else{
            throw new RuntimeException("Null input. Please write some text.");
        }
        if(studentRequestDTO.password() != null){
            String userPassword = studentRequestDTO.password();
            if(userPassword.length() >= 8 && userPassword.matches(".*[^a-zA-Z0-9].*")){
                user.setPassword(passwordEncoder.encode(studentRequestDTO.password()));
            }else{
                throw new RuntimeException("Password doesn't follow the rules.");
            }
        }else{
            throw new RuntimeException("Null input. Please write some text.");
        }
        user.setRole(Role.ROLE_STUDENT);
        if(studentRequestDTO.username() != null){
            user.setUsername(studentRequestDTO.username());
        }else{
            throw new RuntimeException("Null input. Please write some text.");
        }
        user.setCreatedAt(LocalDateTime.now());
        userRepository.save(user);

        Student student = new Student();
        student.setFirstName(studentRequestDTO.firstName());
        student.setLastName(studentRequestDTO.lastName());
        student.setCreatedAt(LocalDateTime.now());
        student.setUser(user);
        studentRepository.save(student);

        return new StudentResponseDTO(
                student.getUser().getUsername(),
                student.getUser().getEmail()
        );
    }

    public TeacherResponseDTO registerTeacher(TeacherRequestDTO teacherRequestDTO){
        if(userRepository.findByEmail(teacherRequestDTO.email()).isPresent()){
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        if(teacherRequestDTO.username() != null){
            user.setUsername(teacherRequestDTO.username());
        }else{
            throw new RuntimeException("Null input. Please write some text.");
        }
        if(teacherRequestDTO.email() != null){
            user.setEmail(teacherRequestDTO.email());
        }else{
            throw new RuntimeException("Null input. Please write some text.");
        }
        if(teacherRequestDTO.password() != null){
            String userPassword = teacherRequestDTO.password();
            if(userPassword.length() >= 8 && userPassword.matches(".*[^a-zA-Z0-9].*")){
                user.setPassword(passwordEncoder.encode(teacherRequestDTO.password()));
            }else{
                throw new RuntimeException("Password doesn't follow the rules.");
            }
        }else{
            throw new RuntimeException("Null input. Please write some text.");
        }
        user.setRole(Role.ROLE_TEACHER);
        user.setCreatedAt(LocalDateTime.now());
        userRepository.save(user);

        Teacher teacher = new Teacher();
        teacher.setUser(user);
        teacherRepository.save(teacher);
        return new TeacherResponseDTO(
                teacher.getUser().getUsername(),
                teacher.getUser().getEmail()
        );
    }


}
