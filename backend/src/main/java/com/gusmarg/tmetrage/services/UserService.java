package com.gusmarg.tmetrage.services;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gusmarg.tmetrage.dto.OtherUserDetailsDTO;
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

	@Transactional
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
	public List<UserSearchDTO> searchUsers(String name) {

		List<User> result = userRepository.searchUsers(name);

		log.info("Buscando por: {}", name);

		return result.stream().map(
				user -> new UserSearchDTO(user.getId(), user.getName(), user.getUsername(), user.getAvatar()))
				.toList();
	}

	@Transactional(readOnly = true)
	public OtherUserDetailsDTO findByProfileName(String profileName) {

		User user = userRepository.findByProfileName(profileName);

		Double avgScore = ratingRepository.findAvgScoreByUserId(user.getId());

		if(avgScore == null) {
			avgScore = 0.0;
		}
		
		log.info("Perfil encontrado: {}", profileName);

		return new OtherUserDetailsDTO(user, avgScore);
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
		currentUser.setAvatar(dto.getAvatar());
		currentUser.setBackgroundImgUrl(dto.getBackgroundImgUrl());
		currentUser = userRepository.save(currentUser);

		log.info("Perfil editado: {}", currentUser.getUsername());

		return new UserDetailsDTO(currentUser);
	}
	
	@Transactional
	public void updatePassword(UserUpdatePasswordDTO dto) {
		
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
	public void toggleFollow(Long id) {

		User user = authService.getAuthenticatedUser();

	    if (user.getId().equals(id)) {
	        throw new RuntimeException("Você não pode seguir a si mesmo");
	    }
		
	    User userFollow = userRepository.getReferenceById(id);

		if (user.getFollowing().contains(userFollow)) {

		    user.getFollowing().remove(userFollow);

		    log.info("Usuário '{}' deixou de seguir '{}'", user.getUsername(), userFollow.getUsername());

		} else {
		    user.getFollowing().add(userFollow);

		    log.info("Usuário '{}' passou a seguir '{}'", user.getUsername(), userFollow.getUsername());
		}
	}
	

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		return userRepository.findByEmail(username);
	}


}
