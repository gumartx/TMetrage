package com.gusmarg.tmetrage.services;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gusmarg.tmetrage.dto.UserLoginDTO;
import com.gusmarg.tmetrage.dto.UserLoginResponseDTO;
import com.gusmarg.tmetrage.entities.User;
import com.gusmarg.tmetrage.repositories.UserRepository;
import com.gusmarg.tmetrage.services.utils.EmailService;
import com.gusmarg.tmetrage.services.utils.JwtService;
import com.gusmarg.tmetrage.services.utils.PasswordGenerator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
	private final EmailService emailService;
    private final JwtService jwtService;

    @Transactional(readOnly = true)
    public UserLoginResponseDTO login(UserLoginDTO dto) {

        User entity = userRepository.findByEmail(dto.getEmail());

        boolean passwordMatches =
                passwordEncoder.matches(dto.getPassword(), entity.getPassword());

        if (!passwordMatches) {
            throw new RuntimeException("Senha incorreta");
        }

        String token = jwtService.generateToken(entity.getEmail());
        
		log.info("Login efetuado com: {}", entity.getEmail());
        
        return new UserLoginResponseDTO(token, entity.getName(), entity.getProfileName(), entity.getProfileImgUrl());
    }

    @Transactional(readOnly = true)
    public User getAuthenticatedUser() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email);
    }

	@Transactional
	public void resetPassword(String email) {

		User entity = userRepository.findByEmail(email);

		String newPassword = PasswordGenerator.generatePassword(8);
		String encryptedPassword = passwordEncoder.encode(newPassword);
		
		entity.setPassword(encryptedPassword);

		userRepository.save(entity);

		log.info("Senha alterada");
		
		emailService.sendEmail(entity.getEmail(), "TMétrage: Nova senha da sua conta", "Sua nova senha é: " + newPassword);

		log.info("Email enviado para: {}", entity.getEmail());
	}
}
