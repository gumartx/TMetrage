package com.gusmarg.tmetrage.dto;

import com.gusmarg.tmetrage.entities.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserDTO {

	private Long id;
    private String name;
    private String profileName;
    private String email;
	
    public UserDTO(User entity) {
		id = entity.getId();
		name = entity.getName();
		profileName = entity.getProfileName();
		email = entity.getEmail();
	}
    
}
