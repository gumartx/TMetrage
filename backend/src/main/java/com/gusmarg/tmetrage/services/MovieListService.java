package com.gusmarg.tmetrage.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gusmarg.tmetrage.dto.AddMovieDTO;
import com.gusmarg.tmetrage.dto.CreateListDTO;
import com.gusmarg.tmetrage.dto.MovieDTO;
import com.gusmarg.tmetrage.dto.MovieListResponseDTO;
import com.gusmarg.tmetrage.entities.Movie;
import com.gusmarg.tmetrage.entities.MovieList;
import com.gusmarg.tmetrage.entities.User;
import com.gusmarg.tmetrage.repositories.MovieListRepository;
import com.gusmarg.tmetrage.repositories.MovieRepository;
import com.gusmarg.tmetrage.repositories.UserRepository;
import com.gusmarg.tmetrage.services.utils.TMDBService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class MovieListService {

	private final TMDBService tmdbService;
	private final MovieRepository movieRepository;
	private final MovieListRepository movieListRepository;
	private final UserRepository userRepository;

	@Transactional
	public MovieListResponseDTO createList(Long id, CreateListDTO dto) {

		User user = userRepository.getReferenceById(id);

		MovieList entity = new MovieList();
		entity.setName(dto.getName());
		entity.setDescription(dto.getDescription());
		entity.setUser(user);
		entity = movieListRepository.save(entity);

		log.info("Lista '{}' criada", entity.getName());

		return new MovieListResponseDTO(entity);
	}

	public MovieListResponseDTO addMovieToList(Long listId, AddMovieDTO dto) {

		MovieList entity = movieListRepository.getReferenceById(listId);

		Movie movie = movieRepository.findById(dto.getId()).orElseGet(() -> {

			MovieDTO tmdbMovie = tmdbService.getMovieById(dto.getId());
			Movie newMovie = new Movie();
			newMovie.setId(tmdbMovie.getId());
			newMovie.setTitle(tmdbMovie.getTitle());
			return movieRepository.save(newMovie);
		});

		entity.getMovies().add(new Movie(movie.getId(), movie.getTitle()));
		entity = movieListRepository.save(entity);

		log.info("Filme '{}' adicionado a lista '{}'", movie.getTitle(), entity.getName());

		return new MovieListResponseDTO(entity);
	}
}
