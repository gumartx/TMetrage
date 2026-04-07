package com.gusmarg.tmetrage.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.gusmarg.tmetrage.entities.Movie;
import com.gusmarg.tmetrage.entities.MovieList;
import com.gusmarg.tmetrage.entities.Rating;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MovieListDetailsDTO {

	private Long id;
	private String name;
	private String description;
	@JsonFormat(pattern = "dd/MM/yyyy")
	private LocalDate createdAt;
	private Integer totalMovies;
	private List<RatedMovieDTO> movies = new ArrayList<>();
	private boolean owner;
	
	public MovieListDetailsDTO(MovieList entity, List<Rating> ratings, boolean owner) {
		id = entity.getId();
		name = entity.getName();
		description = entity.getDescription();
		createdAt = entity.getCreatedAt();
		totalMovies = entity.getAmountMovies();
		this.owner = owner;
		
		for (Movie m : entity.getMovies()) {
			movies.add(new RatedMovieDTO(m, ratings));
		}
	}
}
