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
public class UserDetailsDTO extends UserDTO {

    private String email;
    private Integer amountLists;
    
	public UserDetailsDTO(User entity, Double avgScore) {
		super(entity, avgScore);
		this.email = entity.getEmail();
		this.amountLists = entity.getAmountLists();
	}

	public UserDetailsDTO(User entity) {
		super(entity);
	}
    
}
