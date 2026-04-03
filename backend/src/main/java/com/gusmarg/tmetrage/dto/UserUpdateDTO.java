package com.gusmarg.tmetrage.dto;

import com.gusmarg.tmetrage.entities.User;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserUpdateDTO {

	@Size(min = 3)
	@Size(max = 50)
    private String name;
	@Size(max = 25)
	@Size(min = 3)
    private String profileName;
	@Size(min = 1)
	@Size(max = 500)
    private String bio; 
    @Pattern(regexp = "^(http(s?):)([/|.|\\w|\\s|-])*\\.(?:jpg|jpeg|png|gif)$")
    private String avatar;
    @Pattern(regexp = "^(http(s?):)([/|.|\\w|\\s|-])*\\.(?:jpg|jpeg|png|gif)$")
    private String cover;
	
    public UserUpdateDTO(User entity) {
		name = entity.getName();
		profileName = entity.getProfileName();
		bio = entity.getBio();
		avatar = entity.getAvatar();
		cover = entity.getBackgroundImgUrl();
	}
    
}
