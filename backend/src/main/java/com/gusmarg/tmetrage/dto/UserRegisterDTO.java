package com.gusmarg.tmetrage.dto;

import com.gusmarg.tmetrage.entities.User;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserRegisterDTO {

	@NotBlank
    private String name;
	@NotBlank
    private String profileName;
	@NotBlank
	@Email
    private String email;
	@NotBlank
	@Size(min = 6)
    private String password;
	
    public UserRegisterDTO(User entity) {
		name = entity.getName();
		profileName = entity.getProfileName();
		email = entity.getEmail();
		password = entity.getPassword();
	}
    
}
