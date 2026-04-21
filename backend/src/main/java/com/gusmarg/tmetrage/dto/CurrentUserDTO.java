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
public class CurrentUserDTO {

    private String profileName;
	private String avatar;
    
	public CurrentUserDTO(User entity) {
		profileName = entity.getProfileName();
		avatar = entity.getAvatar();
	}
	
}
