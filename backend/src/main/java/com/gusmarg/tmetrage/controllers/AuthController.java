package com.gusmarg.tmetrage.controllers;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.gusmarg.tmetrage.dto.UserDTO;
import com.gusmarg.tmetrage.dto.UserRegisterDTO;
import com.gusmarg.tmetrage.dto.UserUpdatePasswordDTO;
import com.gusmarg.tmetrage.services.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/auth")
public class AuthController {

	private final UserService userService;
	
	@PostMapping(value = "/cadastro")
	public ResponseEntity<UserDTO> register(@RequestBody @Valid UserRegisterDTO dto) {
		UserDTO newDTO = userService.save(dto);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(newDTO.getId()).toUri();
		return ResponseEntity.created(uri).body(newDTO);
	}
	
	@PostMapping("/esqueci-senha")
	public ResponseEntity<Void> forgotPassword(@RequestParam String email){
	    userService.resetPassword(email);
	    return ResponseEntity.ok().build();
	}
	
	@PutMapping(value = "/{id}")
	public ResponseEntity<Void> changePassword(@PathVariable Long id, @RequestBody @Valid UserUpdatePasswordDTO dto) {
		userService.updatePassword(id, dto);
		return ResponseEntity.ok().build();
	}
}
