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
public class ShareListDTO {

	private String profileName;
	private String name;
	private String avatar;

	public ShareListDTO(User entity) {
		profileName = entity.getProfileName();
		name = entity.getName();
		avatar = entity.getAvatar();
	}

}
