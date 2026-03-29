package com.gusmarg.tmetrage.services;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gusmarg.tmetrage.dto.UserDTO;
import com.gusmarg.tmetrage.dto.UserDetailsDTO;
import com.gusmarg.tmetrage.dto.UserRegisterDTO;
import com.gusmarg.tmetrage.dto.UserSearchDTO;
import com.gusmarg.tmetrage.dto.UserUpdateDTO;
import com.gusmarg.tmetrage.entities.User;
import com.gusmarg.tmetrage.repositories.UserRepository;
import com.gusmarg.tmetrage.utils.PasswordGenerator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserService {

	private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
	private final EmailService emailService;

	@Transactional(readOnly = true)
	public List<UserSearchDTO> searchUsers(String name) {

		List<User> result = userRepository.searchUsers(name);

		log.info("Buscando por: {}", name);

		return result.stream().map(
				user -> new UserSearchDTO(user.getId(), user.getName(), user.getProfileName(), user.getProfileImgUrl()))
				.toList();
	}

	@Transactional(readOnly = true)
	public UserDetailsDTO findByProfileName(String profileName) {

		User result = userRepository.findByProfileName(profileName);

		log.info("Perfil encontrado: {}", profileName);

		return new UserDetailsDTO(result);
	}

	@Transactional
	public UserDTO save(UserRegisterDTO dto) {
		User entity = new User();
		entity.setName(dto.getName());
		entity.setProfileName(dto.getProfileName());
		entity.setEmail(dto.getEmail());
		entity.setPassword(passwordEncoder.encode(dto.getPassword()));
		entity = userRepository.save(entity);

		log.info("Perfil cadastrado: {}", entity.getProfileName());

		return new UserDTO(entity);
	}

	@Transactional
	public UserDetailsDTO updateProfile(Long id, UserUpdateDTO dto) {
		User entity = userRepository.getReferenceById(id);
		entity.setName(dto.getName());
		entity.setProfileName(dto.getProfileName());
		entity.setBio(dto.getBio());
		entity.setProfileImgUrl(dto.getProfileImgUrl());
		entity.setBackgroundImgUrl(dto.getBackgroundImgUrl());
		entity = userRepository.save(entity);

		log.info("Perfil editado: {}", entity.getProfileName());

		return new UserDetailsDTO(entity);
	}

	@Transactional
	public void resetPassword(String email) {

		User user = userRepository.findByEmail(email);

		String newPassword = PasswordGenerator.generatePassword(8);
		String encryptedPassword = passwordEncoder.encode(newPassword);
		
		user.setPassword(encryptedPassword);

		userRepository.save(user);

		log.info("Senha alterada");
		
		emailService.sendEmail(user.getEmail(), "Nova senha da sua conta", "Sua nova senha é: " + newPassword);

		log.info("Email enviado para: {}", email);
	}

}
