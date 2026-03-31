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
    private String profileImgUrl;
    private String backgroundImgUrl;
    private Integer amountFollowers;
    private Integer amountFollowing;
    private Integer amountRatedMovies;
    private Integer amountComments;
    private Double avgScore;
	
    public UserDTO(User entity, Double avgScore) {
		id = entity.getId();
		name = entity.getName();
		profileName = entity.getProfileName();
		bio = entity.getBio();
		profileImgUrl = entity.getProfileImgUrl();
		backgroundImgUrl = entity.getBackgroundImgUrl();
		amountFollowers = entity.getAmountFollowers();
		amountFollowing = entity.getAmountFollowing();
		amountRatedMovies = entity.getAmountRatedMovies();
		this.avgScore = avgScore;
		amountComments = entity.getAmountComments();
	}
    
    public UserDTO(User entity) {
		id = entity.getId();
		name = entity.getName();
		profileName = entity.getProfileName();
		bio = entity.getBio();
		profileImgUrl = entity.getProfileImgUrl();
		backgroundImgUrl = entity.getBackgroundImgUrl();
		amountFollowers = entity.getAmountFollowers();
		amountFollowing = entity.getAmountFollowing();
		amountRatedMovies = entity.getAmountRatedMovies();
		amountComments = entity.getAmountComments();
	}
}
