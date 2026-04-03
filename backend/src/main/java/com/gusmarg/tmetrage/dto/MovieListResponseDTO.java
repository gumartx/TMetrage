package com.gusmarg.tmetrage.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.gusmarg.tmetrage.entities.Movie;
import com.gusmarg.tmetrage.entities.MovieList;

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
	@JsonFormat(pattern = "dd/MM/yyyy")
	private LocalDate createdAt;
	private Integer amountMovies;
	private List<MovieDTO> movies = new ArrayList<>();
	
	public MovieListResponseDTO(MovieList entity) {
		id = entity.getId();
		name = entity.getName();
		description = entity.getDescription();
		createdAt = entity.getCreatedAt();
		amountMovies = entity.getAmountMovies();
		
		for (Movie movie : entity.getMovies()) {
			movies.add(new MovieDTO(movie.getId(), movie.getTitle(), movie.getPosterPath()));
		}
	}
	
}
