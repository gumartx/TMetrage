package com.gusmarg.tmetrage.dto;

import java.util.ArrayList;
import java.util.List;

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
	private Integer totalLists;
	private List<TopGenreDTO> topGenres;
	private List<RatingDTO> ratings;
	private List<ReviewDTO> reviews;

	public UserDetailsDTO(User entity, Double avgScore) {
		super(entity, avgScore);
		this.email = entity.getEmail();
		this.totalLists = entity.getAmountLists();
		this.topGenres = new ArrayList<>();
		ratings = entity
				.getRatings().stream().map(r -> new RatingDTO(r.getMovie().getId(), r.getMovie().getTitle(),
						r.getMovie().getPosterPath(), r.getScore(), r.getCreatedAt()))
				.toList();
		reviews = entity.getComments().stream().map(c -> new ReviewDTO(c.getId(), c.getMovie().getId(), c.getMovie().getTitle(),
				c.getMovie().getPosterPath(), c.getMessage(), c.getCreatedAt())).toList();
	}

	public UserDetailsDTO(User entity) {
		super(entity);
	}

}
