package com.gusmarg.tmetrage.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gusmarg.tmetrage.dto.UserDetailsDTO;
import com.gusmarg.tmetrage.dto.UserSearchDTO;
import com.gusmarg.tmetrage.services.UserService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/perfis")
public class UserController {

	private final UserService userService;

	@GetMapping("/buscar")
	public ResponseEntity<List<UserSearchDTO>> searchUsers(@RequestParam String name) {

		List<UserSearchDTO> result = userService.searchUsers(name);

		return ResponseEntity.ok(result);
	}

	@GetMapping("/usuario/{profileName}")
	public ResponseEntity<UserDetailsDTO> findByProfileName(@PathVariable String profileName) {

		UserDetailsDTO result = userService.findByProfileName(profileName);

		return ResponseEntity.ok(result);
	}
}
