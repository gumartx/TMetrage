package com.gusmarg.tmetrage.controllers;

import java.util.List;

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

import com.gusmarg.tmetrage.dto.UserDetailsDTO;
import com.gusmarg.tmetrage.dto.UserSearchDTO;
import com.gusmarg.tmetrage.dto.UserUpdateDTO;
import com.gusmarg.tmetrage.services.UserService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/perfis")
public class UserController {

	private final UserService userService;

	@GetMapping()
	public ResponseEntity<UserDetailsDTO> userDetails() {
		UserDetailsDTO result = userService.showUserDetails();
		return ResponseEntity.ok(result);
	}
	
	@GetMapping(value = "/buscar")
	public ResponseEntity<List<UserSearchDTO>> searchUsers(@RequestParam String nome) {

		List<UserSearchDTO> result = userService.searchUsers(nome);

		return ResponseEntity.ok(result);
	}

	@GetMapping(value = "/usuario/{nomePerfil}")
	public ResponseEntity<UserDetailsDTO> findByProfileName(@PathVariable String nomePerfil) {

		UserDetailsDTO result = userService.findByProfileName(nomePerfil);

		return ResponseEntity.ok(result);
	}
	
	@PutMapping()
	public ResponseEntity<UserDetailsDTO> updateProfile(@RequestBody UserUpdateDTO dto) {
		UserDetailsDTO newDTO = userService.updateProfile(dto);
		return ResponseEntity.ok(newDTO);
	}
	
	@PostMapping("/{id}/seguir")
	public ResponseEntity<Void> followUser(@PathVariable Long id) {
	    userService.followUser(id);
	    return ResponseEntity.noContent().build();
	}
	
	@DeleteMapping("/{id}/seguir")
	public ResponseEntity<Void> unfollowUser(@PathVariable Long id) {
	    userService.unfollowUser(id);
	    return ResponseEntity.noContent().build();
	} 
}
