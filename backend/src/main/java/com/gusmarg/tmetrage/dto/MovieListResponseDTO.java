package com.gusmarg.tmetrage.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.gusmarg.tmetrage.entities.Movie;
import com.gusmarg.tmetrage.entities.MovieList;
import com.gusmarg.tmetrage.entities.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MovieListResponseDTO {

	private Long id;
	private String name;
	private String description;
	private List<MovieDTO> movies = new ArrayList<>();
	private boolean owner;
	private UserSearchDTO ownerUser;
	private LocalDate createdAt;
	@JsonProperty("isPublic")
	private boolean isPublic = false;
	@JsonProperty("isShared")
	private boolean isShared = false;
	

	public MovieListResponseDTO(MovieList entity, User user, boolean owner) {
		id = entity.getId();
		name = entity.getName();
		ownerUser = new UserSearchDTO(entity.getUser());
		description = entity.getDescription();
		createdAt = entity.getCreatedAt();
		this.owner = owner;
		this.isPublic = entity.isPublic();
		this.isShared = entity.isShared();
		for (Movie movie : entity.getMovies()) {
			movies.add(new MovieDTO(movie));
		}
	}

}
