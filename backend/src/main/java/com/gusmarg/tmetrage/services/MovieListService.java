package com.gusmarg.tmetrage.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gusmarg.tmetrage.components.TMDBSaveData;
import com.gusmarg.tmetrage.dto.MovieListCreateDTO;
import com.gusmarg.tmetrage.dto.MovieListDetailsDTO;
import com.gusmarg.tmetrage.dto.MovieListResponseDTO;
import com.gusmarg.tmetrage.dto.MovieListUpdateDTO;
import com.gusmarg.tmetrage.dto.ShareListToDTO;
import com.gusmarg.tmetrage.dto.SharedListsDTO;
import com.gusmarg.tmetrage.entities.Movie;
import com.gusmarg.tmetrage.entities.MovieList;
import com.gusmarg.tmetrage.entities.Rating;
import com.gusmarg.tmetrage.entities.User;
import com.gusmarg.tmetrage.repositories.MovieListRepository;
import com.gusmarg.tmetrage.repositories.MovieRepository;
import com.gusmarg.tmetrage.repositories.RatingRepository;
import com.gusmarg.tmetrage.repositories.UserRepository;
import com.gusmarg.tmetrage.services.utils.TMDBService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class MovieListService {

	private final AuthService authService;
	private final TMDBService tmdbService;
	private final RatingRepository ratingRepository;
	private final MovieRepository movieRepository;
	private final MovieListRepository movieListRepository;
	private final UserRepository userRepository;

	@Transactional(readOnly = true)
	public MovieListDetailsDTO findById(Long listId) {
		User user = authService.getAuthenticatedUser();

		MovieList list = movieListRepository.findByListId(listId, user.getId());

		List<Rating> ratings = new ArrayList<>();
		
		for (Movie movie : list.getMovies()) {
			Rating rating = ratingRepository.findByIdUserIdAndIdMovieId(user.getId(), movie.getId()).orElse(null);
			if (rating != null) {
				ratings.add(rating);
			}
		}
		
		log.info("Detalhes da lista '{}'", list.getName());
		
		return new MovieListDetailsDTO(list, ratings);
	}

	@Transactional(readOnly = true)
	public List<MovieListResponseDTO> findLists(String name, Integer month, Integer year) {

		User user = authService.getAuthenticatedUser();

		List<MovieList> lists = movieListRepository.searchUserLists(user.getId(), name, month, year);

		log.info("Encontrado {} lista(s)", lists.size());

		return lists.stream().map(MovieListResponseDTO::new).toList();
	}

	@Transactional
	public MovieListResponseDTO createList(MovieListCreateDTO dto) {

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
	public MovieListResponseDTO updateList(Long listId, @Valid MovieListUpdateDTO dto) {

		User user = authService.getAuthenticatedUser();

		MovieList entity = movieListRepository.getReferenceById(listId);

		validateListPermission(entity, user);

		entity.setName(dto.getName());
		entity.setDescription(dto.getDescription());
		entity = movieListRepository.save(entity);

		log.info("Lista '{}' editada", entity.getId());

		return new MovieListResponseDTO(entity);
	}

	@Transactional
	public void deleteList(Long listId) {
		User user = authService.getAuthenticatedUser();

		MovieList entity = movieListRepository.getReferenceById(listId);

		if (!user.getId().equals(entity.getUser().getId())) {
			throw new RuntimeException("Você não pode deletar essa lista");
		}

		movieListRepository.deleteById(listId);

		log.info("Lista '{}' deletada", entity.getName());

	}

	@Transactional
	public void addMovieToList(Long listId, Long movieId) {

		User user = authService.getAuthenticatedUser();

		MovieList entity = movieListRepository.getReferenceById(listId);

		validateListPermission(entity, user);

		Movie movie = movieRepository.findById(movieId).orElseGet(() -> {
			return TMDBSaveData.saveMovieFromTMDB(movieId, tmdbService, movieRepository);
		});

		entity.getMovies().add(movie);

		log.info("Filme '{}' adicionado a lista '{}'", movie.getTitle(), entity.getName());

	}

	@Transactional
	public void removeMovieFromList(Long listId, Long movieId) {

		User user = authService.getAuthenticatedUser();

		MovieList entity = movieListRepository.getReferenceById(listId);

		validateListPermission(entity, user);

		entity.getMovies().removeIf(movie -> movie.getId().equals(movieId));

		log.info("Filme '{}' removido da lista '{}'", movieId, entity.getName());

	}

	@Transactional
	public void shareList(Long listId, ShareListToDTO shareTo) {

		User currentUser = authService.getAuthenticatedUser();

		MovieList list = movieListRepository.getReferenceById(listId);

		if (!currentUser.getId().equals(list.getUser().getId())) {
			throw new RuntimeException("Você não pode compartilhar essa lista");
		}

		for (String i : shareTo.getSharedTo()) {
			User user = userRepository.findByProfileName(i);

			boolean currentUserFollows = userRepository.existsFollow(currentUser.getId(), user.getId());
			boolean userFollowsBack = userRepository.existsFollow(user.getId(), currentUser.getId());

			if (!currentUserFollows || !userFollowsBack) {
				throw new RuntimeException("A lista só pode ser compartilhada com usuários que se seguem mutuamente");
			}

			list.getSharedWith().add(user);

			log.info("Lista '{}' compartilhada com '{}'", list.getName(), user.getProfileName());
		}

	}

	@Transactional(readOnly = true)
	public List<SharedListsDTO> findSharedLists(String nome, Integer mes, Integer ano) {

		User user = authService.getAuthenticatedUser();

		List<MovieList> userLists = movieListRepository.searchUserLists(user.getId(), nome, mes, ano);

		List<MovieList> sharedLists = userLists.stream().filter(list -> !list.getSharedWith().isEmpty()).toList();

		return sharedLists.stream().map(list -> new SharedListsDTO(list, user)).toList();
	}

	private void validateListPermission(MovieList list, User user) {

		boolean isOwner = list.getUser().getId().equals(user.getId());
		boolean isSharedUser = list.getSharedWith().stream().anyMatch(u -> u.getId().equals(user.getId()));

		if (!isOwner && !isSharedUser) {
			throw new RuntimeException("Você não tem permissão para alterar essa lista");
		}
	}

}
