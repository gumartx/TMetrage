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
    private String bio;
    private String avatar;
    private String cover;
    private Integer followers;
    private Integer following;
    private Integer totalRatings;
    private Integer totalComments;
    private Double avgRating;
	
    public UserDTO(User entity, Double avgScore) {
		id = entity.getId();
		name = entity.getName();
		profileName = entity.getProfileName();
		bio = entity.getBio();
		avatar = entity.getAvatar();
		cover = entity.getBackgroundImgUrl();
		followers = entity.getAmountFollowers();
		following = entity.getAmountFollowing();
		totalRatings = entity.getAmountRatedMovies();
		avgRating = avgScore;
		totalComments = entity.getAmountComments();
	}
    
    public UserDTO(User entity) {
		id = entity.getId();
		name = entity.getName();
		profileName = entity.getProfileName();
		bio = entity.getBio();
		avatar = entity.getAvatar();
		cover = entity.getBackgroundImgUrl();
		followers = entity.getAmountFollowers();
		following = entity.getAmountFollowing();
		totalRatings = entity.getAmountRatedMovies();
		totalComments = entity.getAmountComments();
	}
}
