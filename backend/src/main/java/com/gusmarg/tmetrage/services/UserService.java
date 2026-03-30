package com.gusmarg.tmetrage.services;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gusmarg.tmetrage.dto.UserDTO;
import com.gusmarg.tmetrage.dto.UserDetailsDTO;
import com.gusmarg.tmetrage.dto.UserRegisterDTO;
import com.gusmarg.tmetrage.dto.UserSearchDTO;
import com.gusmarg.tmetrage.dto.UserUpdateDTO;
import com.gusmarg.tmetrage.dto.UserUpdatePasswordDTO;
import com.gusmarg.tmetrage.entities.User;
import com.gusmarg.tmetrage.repositories.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserService implements UserDetailsService {

	private final AuthService authService;
	private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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
	public UserDTO register(UserRegisterDTO dto) {
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
	public UserDetailsDTO updateProfile(UserUpdateDTO dto) {
		User currentUser = authService.getAuthenticatedUser();
		
		currentUser.setName(dto.getName());
		currentUser.setProfileName(dto.getProfileName());
		currentUser.setBio(dto.getBio());
		currentUser.setProfileImgUrl(dto.getProfileImgUrl());
		currentUser.setBackgroundImgUrl(dto.getBackgroundImgUrl());
		currentUser = userRepository.save(currentUser);

		log.info("Perfil editado: {}", currentUser.getProfileName());

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
	public void followUser(Long id) {

	    User currentUser = authService.getAuthenticatedUser();

	    User userToFollow = userRepository.getReferenceById(id);

	    currentUser.getFollowing().add(userToFollow);

	    userRepository.save(currentUser);
	    
	    log.info("Usuário '{}' passou a seguir '{}'", currentUser.getProfileName(), userToFollow.getProfileName());
	}
	
	@Transactional
	public void unfollowUser(Long id) {

	    User currentUser = authService.getAuthenticatedUser();
	    User userToUnfollow = userRepository.getReferenceById(id);

	    currentUser.getFollowing().remove(userToUnfollow);

	    userRepository.save(currentUser);
	    
	    log.info("Usuário '{}' deixou de seguir '{}'", currentUser.getProfileName(), userToUnfollow.getProfileName());
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		return userRepository.findByEmail(username);
	}

}
