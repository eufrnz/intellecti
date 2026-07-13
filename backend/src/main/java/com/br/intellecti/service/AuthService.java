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

    public AuthService(AuthenticationManager authenticationManager, TokenService tokenService, StudentRepository studentRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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
        user.setEmail(studentRequestDTO.email());
        user.setPassword(passwordEncoder.encode(studentRequestDTO.password()));
        user.setRole(Role.ROLE_STUDENT);
        user.setUsername(studentRequestDTO.username());
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
        user.setUsername(teacherRequestDTO.username());
        user.setEmail(teacherRequestDTO.email());
        user.setPassword(passwordEncoder.encode(teacherRequestDTO.password()));
        user.setRole(Role.ROLE_TEACHER);
        user.setCreatedAt(LocalDateTime.now());
        userRepository.save(user);

        Teacher teacher = new Teacher();
        teacher.setUser(user);
        return new TeacherResponseDTO(
                teacher.getUser().getUsername(),
                teacher.getUser().getEmail()
        );
    }


}
