package com.gusmarg.tmetrage.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

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
	
	public MovieListResponseDTO(MovieList entity, User user, boolean owner) {
		id = entity.getId();
		name = entity.getName();
		description = entity.getDescription();
		createdAt = entity.getCreatedAt();
		this.owner = owner;
		this.ownerUser = new UserSearchDTO(entity.getUser());
		for (Movie movie : entity.getMovies()) {
			movies.add(new MovieDTO(movie.getId(), movie.getPosterPath(), movie.getPosterPath()));
		}
	}
	
}
