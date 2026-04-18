package com.gusmarg.tmetrage.controllers;

import java.io.IOException;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.gusmarg.tmetrage.dto.UserDetailsDTO;
import com.gusmarg.tmetrage.dto.UserSearchDTO;
import com.gusmarg.tmetrage.dto.UserUpdateDTO;
import com.gusmarg.tmetrage.dto.UserUpdatePasswordDTO;
import com.gusmarg.tmetrage.services.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/users")
public class UserController {

	private final UserService userService;

	@GetMapping("/me")
	public ResponseEntity<String> currentUser() {
		return ResponseEntity.ok(userService.currentUser());
	}
	
	@GetMapping()
	public ResponseEntity<UserDetailsDTO> userDetails() {
		UserDetailsDTO result = userService.showUserDetails();
		return ResponseEntity.ok(result);
	}
	
	@GetMapping(value = "/followers")
	public ResponseEntity<List<UserSearchDTO>> getFollowers() {

		List<UserSearchDTO> result = userService.getUserFollowers();

		return ResponseEntity.ok(result);
	}
	
	@GetMapping(value = "/following")
	public ResponseEntity<List<UserSearchDTO>> getFollowing() {

		List<UserSearchDTO> result = userService.getUserFollowing();

		return ResponseEntity.ok(result);
	}
	
	@GetMapping(value = "/search")
	public ResponseEntity<List<UserSearchDTO>> searchUsers(@RequestParam String search) {

		List<UserSearchDTO> result = userService.searchUsers(search);

		return ResponseEntity.ok(result);
	}

	@GetMapping(value = "/profile/{profileName}")
	public ResponseEntity<UserDetailsDTO> findByProfileName(@PathVariable String profileName) {

		UserDetailsDTO result = userService.findByProfileName(profileName);

		return ResponseEntity.ok(result);
	}
	
	@PutMapping()
	public ResponseEntity<UserDetailsDTO> updateProfile(@RequestBody @Valid UserUpdateDTO dto) {
		UserDetailsDTO newDTO = userService.updateProfile(dto);
		return ResponseEntity.ok(newDTO);
	}
	
	@PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<UserDetailsDTO> updateAvatar(@RequestParam MultipartFile file) throws IOException {
		UserDetailsDTO dto = userService.updateAvatar(file);
		return ResponseEntity.ok(dto);
	}
	
	@PostMapping(value = "/cover", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<UserDetailsDTO> updateCover(@RequestParam MultipartFile file) throws IOException {
		UserDetailsDTO dto = userService.updateCover(file);
		return ResponseEntity.ok(dto);
	}
	
	@DeleteMapping(value = "/avatar")
	public ResponseEntity<Void> removeAvatar() {
		userService.removeAvatar();
		return ResponseEntity.noContent().build();
	}
	
	@PutMapping(value = "/password")
	public ResponseEntity<Void> changePassword(@RequestBody @Valid UserUpdatePasswordDTO dto) {
		userService.changePassword(dto);
		return ResponseEntity.noContent().build();
	}
	
	@PutMapping("/{profileName}/follow")
	public ResponseEntity<Void> toggleFollow(@PathVariable String profileName) {
	    userService.toggleFollow(profileName);
	    return ResponseEntity.noContent().build();
	}
	
	@DeleteMapping()
	public ResponseEntity<Void> deleteProfile() {
	    userService.deleteProfile();
	    return ResponseEntity.noContent().build();
	}
	
}
