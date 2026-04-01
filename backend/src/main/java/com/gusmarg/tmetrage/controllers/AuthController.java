package com.gusmarg.tmetrage.controllers;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.gusmarg.tmetrage.dto.UserRegisterResponseDTO;
import com.gusmarg.tmetrage.dto.UserLoginDTO;
import com.gusmarg.tmetrage.dto.UserLoginResponseDTO;
import com.gusmarg.tmetrage.dto.UserRegisterDTO;
import com.gusmarg.tmetrage.dto.UserUpdatePasswordDTO;
import com.gusmarg.tmetrage.services.AuthService;
import com.gusmarg.tmetrage.services.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/auth")
public class AuthController {

	private final AuthService authService;
	private final UserService userService;
	
	@PostMapping(value = "/login")
	public ResponseEntity<UserLoginResponseDTO> login(@RequestBody @Valid UserLoginDTO dto) {
		UserLoginResponseDTO result = authService.login(dto);
		return ResponseEntity.ok(result);
	}
	
	@PostMapping(value = "/register")
	public ResponseEntity<UserRegisterResponseDTO> register(@RequestBody @Valid UserRegisterDTO dto) {
		UserRegisterResponseDTO newDTO = userService.register(dto);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(newDTO.getId()).toUri();
		return ResponseEntity.created(uri).body(newDTO);
	}
	
	@PostMapping("/forgot-password")
	public ResponseEntity<Void> forgotPassword(@RequestParam String email){
	    authService.resetPassword(email);
	    return ResponseEntity.noContent().build();
	}
	
	@PutMapping()
	public ResponseEntity<Void> changePassword(@RequestBody @Valid UserUpdatePasswordDTO dto) {
		userService.updatePassword(dto);
		return ResponseEntity.noContent().build();
	}
}
