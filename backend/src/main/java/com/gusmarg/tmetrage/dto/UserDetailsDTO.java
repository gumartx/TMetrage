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
public class UserDetailsDTO {

	private Long id;
    private String name;
    private String profileName;
    private String email;
    private String bio;
    private String profileImgUrl;
    private String backgroundImgUrl;
    private Integer amountFollowers;
    private Integer amountFollowing;
	
    public UserDetailsDTO(User entity) {
		id = entity.getId();
		name = entity.getName();
		profileName = entity.getProfileName();
		email = entity.getEmail();
		bio = entity.getBio();
		profileImgUrl = entity.getProfileImgUrl();
		backgroundImgUrl = entity.getBackgroundImgUrl();
		amountFollowers = entity.getAmountFollowers();
		amountFollowing = entity.getAmountFollowing();
	}
    
}
