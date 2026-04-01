package com.gusmarg.tmetrage.dto;

import com.gusmarg.tmetrage.entities.User;

import jakarta.validation.constraints.NotBlank;
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

	@NotBlank
	@Size(max = 50)
    private String name;
	@NotBlank
	@Size(max = 25)
    private String profileName;
	@Size(max = 500)
    private String bio; 
    @Pattern(regexp = "^(http(s?):)([/|.|\\w|\\s|-])*\\.(?:jpg|jpeg|png|gif)$")
    private String avatar;
    @Pattern(regexp = "^(http(s?):)([/|.|\\w|\\s|-])*\\.(?:jpg|jpeg|png|gif)$")
    private String backgroundImgUrl;
	
    public UserUpdateDTO(User entity) {
		name = entity.getName();
		profileName = entity.getProfileName();
		bio = entity.getBio();
		avatar = entity.getAvatar();
		backgroundImgUrl = entity.getBackgroundImgUrl();
	}
    
}
