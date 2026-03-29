package com.gusmarg.tmetrage.dto;

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
public class UserUpdatePasswordDTO {

	@NotBlank
	@Size(min = 6)
	private String currentPassword;
	@NotBlank
	@Size(min = 6)
	private String newPassword;
	
}
