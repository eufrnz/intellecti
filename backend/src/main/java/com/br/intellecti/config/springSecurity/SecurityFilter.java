package com.br.intellecti.config.springSecurity;

import com.br.intellecti.models.enums.Role;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.util.Strings;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Configuration
public class SecurityFilter extends OncePerRequestFilter {
    private final TokenService tokenService;

    public SecurityFilter(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authorizationHeader = request.getHeader("Authorization");
        if(Strings.isNotEmpty(authorizationHeader) && authorizationHeader.startsWith("Bearer ")){
            String token = authorizationHeader.substring(7);
            Optional<JWTUserData> userOpt = tokenService.validateToken(token);
            if(userOpt.isPresent()){
                JWTUserData userData = userOpt.get();
                String role = userData.role();
                if(role == null){
                    role = "USER";
                }
                String authority = role.startsWith("ROLE_") ? role : "ROLE" + role;
                var authorities = List.of(new SimpleGrantedAuthority(authority));
                var authentication = new UsernamePasswordAuthenticationToken(
                        userData,
                        null,
                        authorities
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        filterChain.doFilter(request, response);
    }
}
