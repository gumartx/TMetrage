package com.gusmarg.tmetrage.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gusmarg.tmetrage.dto.CreateListDTO;
import com.gusmarg.tmetrage.dto.MovieDTO;
import com.gusmarg.tmetrage.dto.MovieListResponseDTO;
import com.gusmarg.tmetrage.entities.Movie;
import com.gusmarg.tmetrage.entities.MovieList;
import com.gusmarg.tmetrage.entities.User;
import com.gusmarg.tmetrage.repositories.MovieListRepository;
import com.gusmarg.tmetrage.repositories.MovieRepository;
import com.gusmarg.tmetrage.services.utils.TMDBService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class MovieListService {

	private final AuthService authService;
	private final TMDBService tmdbService;
	private final MovieRepository movieRepository;
	private final MovieListRepository movieListRepository;

	@Transactional
	public MovieListResponseDTO createList(CreateListDTO dto) {

		User user = authService.getAuthenticatedUser();

		MovieList entity = new MovieList();
		entity.setName(dto.getName());
		entity.setDescription(dto.getDescription());
		entity.setUser(user);
		entity = movieListRepository.save(entity);

		log.info("Lista '{}' criada", entity.getName());

		return new MovieListResponseDTO(entity);
	}

	@Transactional
	public MovieListResponseDTO addMovieToList(Long listId, MovieDTO dto) {

	    User user = authService.getAuthenticatedUser();

	    MovieList entity = movieListRepository.getReferenceById(listId);

	    if (!entity.getUser().getId().equals(user.getId())) {
	        throw new RuntimeException("Você não pode alterar essa lista");
	    }

		Movie movie = movieRepository.findById(dto.getId()).orElseGet(() -> {

			MovieDTO tmdbMovie = tmdbService.getMovieById(dto.getId());
			Movie newMovie = new Movie();
			newMovie.setId(tmdbMovie.getId());
			return movieRepository.save(newMovie);
		});

		entity.getMovies().add(new Movie(movie.getId()));
		entity = movieListRepository.save(entity);

		log.info("Filme '{}' adicionado a lista '{}'", movie.getId(), entity.getName());

		return new MovieListResponseDTO(entity);
	}
	
	@Transactional
	public void removeMovieFromList(Long listId, MovieDTO dto) {

	    User user = authService.getAuthenticatedUser();

	    MovieList entity = movieListRepository.getReferenceById(listId);

	    if (!entity.getUser().getId().equals(user.getId())) {
	        throw new RuntimeException("Você não pode alterar essa lista");
	    }

	    entity.getMovies().removeIf(movie -> movie.getId().equals(dto.getId()));

	    movieListRepository.save(entity);

		log.info("Filme '{}' removido da lista '{}'", entity.getId(), entity.getName());

	}
}
