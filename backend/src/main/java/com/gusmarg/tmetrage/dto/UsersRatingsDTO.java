package com.gusmarg.tmetrage.dto;

import com.gusmarg.tmetrage.entities.Movie;
import com.gusmarg.tmetrage.entities.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UsersRatingsDTO {

	private Long movieId;
	private String profileName;
	private String avatar;
	private Double rating;

	public UsersRatingsDTO(User entity, Movie movie) {
		movieId = movie.getId();
		profileName = entity.getProfileName();
		avatar = entity.getAvatar();
		rating = entity.getRatings().stream().filter(s -> s.getMovie().equals(movie)).findFirst().map(s -> s.getScore()).orElse(null);
	}

}
