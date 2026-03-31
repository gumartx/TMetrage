package com.gusmarg.tmetrage.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gusmarg.tmetrage.dto.ListCreateDTO;
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

	private final AuthService authService;
	private final TMDBService tmdbService;
	private final MovieRepository movieRepository;
	private final MovieListRepository movieListRepository;
	private final UserRepository userRepository;

	@Transactional(readOnly = true)
	public List<MovieListResponseDTO> findLists(String name, Integer month, Integer year) {
		
		User user = authService.getAuthenticatedUser();
		
	    List<MovieList> lists = movieListRepository.searchUserLists(user.getId(), name, month, year);

		log.info("Encontrado {} lista(s)", lists.size());
	    
	    return lists.stream().map(MovieListResponseDTO::new).toList();
	}
	
	@Transactional
	public MovieListResponseDTO createList(ListCreateDTO dto) {

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
	public MovieListResponseDTO addMovieToList(Long listId, Long movieId) {

	    User user = authService.getAuthenticatedUser();

	    MovieList entity = movieListRepository.getReferenceById(listId);

	    if (!entity.getUser().getId().equals(user.getId())) {
	        throw new RuntimeException("Você não pode alterar essa lista");
	    }

		Movie movie = movieRepository.findById(movieId).orElseGet(() -> {

			MovieDTO tmdbMovie = tmdbService.getMovieById(movieId);
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
	public void removeMovieFromList(Long listId, Long movieId) {

	    User user = authService.getAuthenticatedUser();

	    MovieList entity = movieListRepository.getReferenceById(listId);

	    if (!entity.getUser().getId().equals(user.getId())) {
	        throw new RuntimeException("Você não pode alterar essa lista");
	    }

	    entity.getMovies().removeIf(movie -> movie.getId().equals(movieId));

	    movieListRepository.save(entity);

		log.info("Filme '{}' removido da lista '{}'", entity.getId(), entity.getName());

	}

	@Transactional
	public void shareList(Long listId, Long userId) {

	    User currentUser = authService.getAuthenticatedUser();

	    MovieList list = movieListRepository.getReferenceById(listId);

	    if(!currentUser.getId().equals(list.getUser().getId())) {
	        throw new RuntimeException("Você não pode compartilhar essa lista");
	    }
	    
	    User user = userRepository.getReferenceById(userId);

	    boolean currentUserFollows = userRepository.existsFollow(currentUser.getId(), userId);
	    boolean userFollowsBack = userRepository.existsFollow(userId, currentUser.getId());

	    if (!currentUserFollows || !userFollowsBack) {
	        throw new RuntimeException("A lista só pode ser compartilhada com usuários que se seguem mutuamente");
	    }
	    
	    list.getSharedWith().add(user);

	    movieListRepository.save(list);

		log.info("Lista '{}' compartilhada com '{}'", list.getName(), user.getProfileName());
	}
}
