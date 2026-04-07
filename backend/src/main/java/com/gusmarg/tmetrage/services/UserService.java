package com.gusmarg.tmetrage.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.gusmarg.tmetrage.dto.UserDetailsDTO;
import com.gusmarg.tmetrage.dto.UserRegisterDTO;
import com.gusmarg.tmetrage.dto.UserRegisterResponseDTO;
import com.gusmarg.tmetrage.dto.UserSearchDTO;
import com.gusmarg.tmetrage.dto.UserUpdateDTO;
import com.gusmarg.tmetrage.dto.UserUpdatePasswordDTO;
import com.gusmarg.tmetrage.entities.User;
import com.gusmarg.tmetrage.repositories.RatingRepository;
import com.gusmarg.tmetrage.repositories.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserService implements UserDetailsService {

	private final AuthService authService;
	private final UserRepository userRepository;
	private final RatingRepository ratingRepository;
    private final PasswordEncoder passwordEncoder;

	@Transactional(readOnly = true)
	public UserDetailsDTO showUserDetails() {
		
		User user = authService.getAuthenticatedUser();

		Double avgScore = ratingRepository.findAvgScoreByUserId(user.getId());

		if(avgScore == null) {
			avgScore = 0.0;
		}
		
		log.info("Detalhes do perfil: {}", user.getProfileName());

		return new UserDetailsDTO(user, avgScore);
	}
	

	@Transactional(readOnly = true)
	public List<UserSearchDTO> getUserFollowers() {

		User user = authService.getAuthenticatedUser();
		
		Set<User> result = userRepository.findFollowersByUserId(user.getId());
		
		return result.stream().map(u -> new UserSearchDTO(u)).toList();
	}
	
	@Transactional(readOnly = true)
	public List<UserSearchDTO> getUserFollowing() {

		User user = authService.getAuthenticatedUser();
		
		Set<User> result = userRepository.findFollowingByUserId(user.getId());
		
		return result.stream().map(u -> new UserSearchDTO(u)).toList();
	}
    
	@Transactional(readOnly = true)
	public List<UserSearchDTO> searchUsers(String search) {

		List<User> result = userRepository.searchUsers(search);

		log.info("Buscando por: {}", search);

		return result.stream().map(
				user -> new UserSearchDTO(user.getId(), user.getName(), user.getProfileName(), user.getAvatar()))
				.toList();
	}

	@Transactional(readOnly = true)
	public UserDetailsDTO findByProfileName(String profileName) {
		User user = userRepository.findByProfileName(profileName);

		Double avgScore = ratingRepository.findAvgScoreByUserId(user.getId());

		if(avgScore == null) {
			avgScore = 0.0;
		}
		
		log.info("Perfil encontrado: {}", profileName);

		return new UserDetailsDTO(user, avgScore);
	}

	@Transactional
	public UserRegisterResponseDTO register(UserRegisterDTO dto) {
		User entity = new User();
		entity.setName(dto.getName());
		entity.setProfileName(dto.getProfileName());
		entity.setEmail(dto.getEmail());
		entity.setPassword(passwordEncoder.encode(dto.getPassword()));
		entity = userRepository.save(entity);

		log.info("Perfil cadastrado: {}", entity.getUsername());

		return new UserRegisterResponseDTO(entity);
	}

	@Transactional
	public UserDetailsDTO updateProfile(UserUpdateDTO dto) {
		User currentUser = authService.getAuthenticatedUser();
		
		currentUser.setName(dto.getName());
		currentUser.setProfileName(dto.getProfileName());
		currentUser.setBio(dto.getBio());
		currentUser = userRepository.save(currentUser);

		log.info("Perfil editado: {}", currentUser.getUsername());

		return new UserDetailsDTO(currentUser);
	}
	
	@Transactional
	public void deleteProfile() {
		User user = authService.getAuthenticatedUser();
		String profile = user.getProfileName();
		
		userRepository.deleteById(user.getId());

		log.info("Perfil deletado: {}", profile);
	}
	
	@Transactional
	public void changePassword(UserUpdatePasswordDTO dto) {
		
		User currentUser = authService.getAuthenticatedUser();
		
		boolean passwordMatches = passwordEncoder.matches(dto.getCurrentPassword(), currentUser.getPassword());
		
		if(!passwordMatches) {
			throw new RuntimeException("Senha atual incorreta");
		}
		
		String newPassword = passwordEncoder.encode(dto.getNewPassword());
		
		currentUser.setPassword(newPassword);
		
		userRepository.save(currentUser);
		
		log.info("Senha alterada");
	}
	
	@Transactional
	public void toggleFollow(String profileName) {
		User user = authService.getAuthenticatedUser();

	    if (user.getProfileName().equals(profileName)) {
	        throw new RuntimeException("Você não pode seguir a si mesmo");
	    }
		
	    User userFollow = userRepository.findByProfileName(profileName);

		if (user.getFollowing().contains(userFollow)) {

		    user.getFollowing().remove(userFollow);

		    log.info("Usuário '{}' deixou de seguir '{}'", user.getProfileName(), userFollow.getProfileName());

		} else {
		    user.getFollowing().add(userFollow);

		    log.info("Usuário '{}' passou a seguir '{}'", user.getProfileName(), userFollow.getProfileName());
		}
	}

	@Transactional
	public UserDetailsDTO updateAvatar(MultipartFile file) throws IOException {

	    User user = authService.getAuthenticatedUser();

	    Path uploadDir = Paths.get("uploads/avatars");

	    if (!Files.exists(uploadDir)) {
	        Files.createDirectories(uploadDir);
	    }
	    
	    if (user.getAvatar() != null) {
	        Path oldFile = Paths.get(user.getAvatar());
	        Files.deleteIfExists(oldFile);
	    }

	    String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

	    Path filePath = uploadDir.resolve(fileName);

	    Files.write(filePath, file.getBytes());

	    user.setAvatar("uploads/avatars/" + fileName);

	    userRepository.save(user);
	    
	    log.info("Usuário '{}' alterou foto de perfil", user.getProfileName());

	    return new UserDetailsDTO(user);
	}
	
	@Transactional
	public UserDetailsDTO updateCover(MultipartFile file) throws IOException {

	    User user = authService.getAuthenticatedUser();

	    Path uploadDir = Paths.get("uploads/covers");

	    if (!Files.exists(uploadDir)) {
	        Files.createDirectories(uploadDir);
	    }

	    if (user.getBackgroundImgUrl() != null) {
	        Path oldFile = Paths.get(user.getBackgroundImgUrl());
	        Files.deleteIfExists(oldFile);
	    }

	    String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

	    Path filePath = uploadDir.resolve(fileName);

	    Files.write(filePath, file.getBytes());

	    user.setBackgroundImgUrl("uploads/covers/" + fileName);

	    userRepository.save(user);
	    
	    log.info("Usuário '{}' alterou plano de fundo do perfil", user.getProfileName());

	    return new UserDetailsDTO(user);
	}

	@Transactional
	public void removeAvatar() {
	    User user = authService.getAuthenticatedUser();

	    String avatarPath = user.getAvatar();

	    if (avatarPath != null) {

	        try {
	            Path path = Paths.get(avatarPath);
	            Files.deleteIfExists(path);
	        } catch (IOException e) {
	            throw new RuntimeException("Erro ao remover avatar");
	        }

	        user.setAvatar(null);
	        userRepository.save(user);
	    }
	}
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		return userRepository.findByEmail(username);
	}


}
