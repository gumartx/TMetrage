package com.gusmarg.tmetrage.components;

import org.springframework.stereotype.Component;

import com.gusmarg.tmetrage.dto.MovieDTO;
import com.gusmarg.tmetrage.entities.Movie;
import com.gusmarg.tmetrage.repositories.MovieRepository;
import com.gusmarg.tmetrage.services.utils.TMDBService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TMDBSaveData {
	
	public static Movie saveMovieFromTMDB (Long movieId, TMDBService tmdbService, MovieRepository movieRepository) {

		MovieDTO tmdbMovie = tmdbService.getMovieById(movieId);
		Movie newMovie = new Movie();
		newMovie.setId(tmdbMovie.getId());
		return movieRepository.save(newMovie);
	};
	
}
