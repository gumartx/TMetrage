package com.gusmarg.tmetrage.components;

import org.springframework.stereotype.Component;

import com.gusmarg.tmetrage.dto.MovieDTO;
import com.gusmarg.tmetrage.entities.Genre;
import com.gusmarg.tmetrage.entities.Movie;
import com.gusmarg.tmetrage.repositories.GenreRepository;
import com.gusmarg.tmetrage.repositories.MovieRepository;
import com.gusmarg.tmetrage.services.utils.TMDBService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TMDBSaveData {

	public static Movie saveMovieFromTMDB(Long movieId, TMDBService tmdbService, MovieRepository movieRepository,
			GenreRepository genreRepository) {

		MovieDTO tmdbMovie = tmdbService.getMovieById(movieId);
		Movie newMovie = new Movie();
		newMovie.setId(tmdbMovie.getId());
		newMovie.setTitle(tmdbMovie.getMovieTitle());
		newMovie.setPosterPath(tmdbMovie.getPosterPath());
		newMovie.setGenres(tmdbMovie.getGenres().stream().map(g -> {
			Genre genre = genreRepository.findById(g.getId()).orElseGet(() -> {
				Genre newGenre = new Genre();
				newGenre.setId(g.getId());
				newGenre.setName(g.getName());
				return genreRepository.save(newGenre);
			});
			return genre;
		}).toList());
		return movieRepository.save(newMovie);
	};

}
