package com.gusmarg.tmetrage.dto;

import com.gusmarg.tmetrage.entities.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OtherUserDetailsDTO extends UserDTO {

	public OtherUserDetailsDTO(User entity, Double avgScore) {
		super(entity, avgScore);
	}
}
