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
import com.gusmarg.tmetrage.entities.ListShare;
import com.gusmarg.tmetrage.entities.Movie;
import com.gusmarg.tmetrage.entities.MovieList;
import com.gusmarg.tmetrage.entities.Rating;
import com.gusmarg.tmetrage.entities.User;
import com.gusmarg.tmetrage.repositories.ListShareRepository;
import com.gusmarg.tmetrage.repositories.MovieListRepository;
import com.gusmarg.tmetrage.repositories.MovieRepository;
import com.gusmarg.tmetrage.repositories.RatingRepository;
import com.gusmarg.tmetrage.repositories.UserRepository;
import com.gusmarg.tmetrage.services.exceptions.ResourceNotFoundException;
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
	private final ListShareRepository listShareRepository;
	private final MovieRepository movieRepository;
	private final MovieListRepository movieListRepository;
	private final UserRepository userRepository;

	@Transactional(readOnly = true)
	public MovieListDetailsDTO findById(Long listId) {
		User user = authService.getAuthenticatedUser();

		MovieList list = movieListRepository.findAccessibleList(listId, user.getId())
				.orElseThrow(() -> new ResourceNotFoundException("Lista não encontrada"));

		List<Rating> ratings = new ArrayList<>();

		for (Movie movie : list.getMovies()) {
			Rating rating = ratingRepository.findByIdUserIdAndIdMovieId(user.getId(), movie.getId()).orElse(null);
			if (rating != null) {
				ratings.add(rating);
			}
		}

		boolean owner = list.getUser().getId().equals(user.getId());
		
		log.info("Detalhes da lista '{}'", list.getName());

		return new MovieListDetailsDTO(list, ratings, owner);
	}

	 @Transactional(readOnly = true)
	    public MovieListDetailsDTO findPublicListByUser(Long listId, String profileName) {
	        User targetUser = userRepository.findByProfileName(profileName);

	        if (targetUser == null) {
	            throw new ResourceNotFoundException("Usuário não encontrado");
	        }

	        MovieList list = movieListRepository.findPublicListByUser(listId, targetUser.getId()).orElseThrow(() -> new ResourceNotFoundException("Lista pública não encontrada"));

			boolean owner = list.getUser().getId().equals(targetUser.getId());
			
			List<Rating> ratings = new ArrayList<>();

			for (Movie movie : list.getMovies()) {
				Rating rating = ratingRepository.findByIdUserIdAndIdMovieId(targetUser.getId(), movie.getId()).orElse(null);
				if (rating != null) {
					ratings.add(rating);
				}
			}
	        
	        log.info("Detalhes da lista pública '{}' do usuário '{}'", list.getName(), profileName);

	        return new MovieListDetailsDTO(list, ratings, owner);
	    }
	
	@Transactional(readOnly = true)
	public List<MovieListResponseDTO> findLists(String name, Integer month, Integer year) {

		User user = authService.getAuthenticatedUser();

		List<MovieList> lists = movieListRepository.searchUserLists(user.getId(), name, month, year);

		log.info("Encontrado {} lista(s)", lists.size());

		return lists.stream().map(list -> {
			boolean owner = list.getUser().getId().equals(user.getId());
			return new MovieListResponseDTO(list, user, owner);
		}).toList();
	}

	 @Transactional(readOnly = true)
	    public List<MovieListResponseDTO> findPublicListsByUser(String profileName, String name, Integer month, Integer year) {
	        User targetUser = userRepository.findByProfileName(profileName);

	        if (targetUser == null) {
	            throw new RuntimeException("Usuário não encontrado");
	        }

	        List<MovieList> lists = movieListRepository.findPublicListsByUser(targetUser.getId(), name, month, year);

	        log.info("Encontrado {} lista(s) pública(s) do usuário '{}'", lists.size(), profileName);

	        return lists.stream()
	                .map(list -> new MovieListResponseDTO(list, targetUser, false))
	                .toList();
	    }
	
	@Transactional
	public MovieListResponseDTO createList(MovieListCreateDTO dto) {

		User user = authService.getAuthenticatedUser();

		MovieList entity = new MovieList();
		entity.setName(dto.getName());
		entity.setDescription(dto.getDescription());
		entity.setPublic(false);
		entity.setUser(user);
		entity = movieListRepository.save(entity);

		log.info("Lista '{}' criada", entity.getName());

		return new MovieListResponseDTO(entity, user, true);
	}

	@Transactional
	public MovieListResponseDTO updateList(Long listId, @Valid MovieListUpdateDTO dto) {

		boolean onwer = false;

		User user = authService.getAuthenticatedUser();

		MovieList entity = movieListRepository.getReferenceById(listId);

		validateListPermission(entity, user);

		entity.setName(dto.getName());
		entity.setDescription(dto.getDescription());
		entity.setPublic(dto.isPublic());
		entity = movieListRepository.save(entity);

		log.info("Lista '{}' editada", entity.getId());

		return new MovieListResponseDTO(entity, user, onwer);
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
	public void shareList(Long listId, ShareListToDTO dto) {

		User currentUser = authService.getAuthenticatedUser();

		MovieList list = movieListRepository.getReferenceById(listId);

		if (!currentUser.getId().equals(list.getUser().getId())) {
			throw new RuntimeException("Você não pode compartilhar essa lista");
		}

		for (String profileName : dto.getSharedTo()) {

			User user = userRepository.findByProfileName(profileName);

			boolean currentUserFollows = userRepository.existsFollow(currentUser.getId(), user.getId());
			boolean userFollowsBack = userRepository.existsFollow(user.getId(), currentUser.getId());

			if (!currentUserFollows || !userFollowsBack) {
				throw new RuntimeException("A lista só pode ser compartilhada com usuários que se seguem mutuamente");
			}

			ListShare share = new ListShare();
			share.setList(list);
			share.setSharedBy(currentUser);
			share.getSharedTo().add(user);

			list.getShares().add(share);

			log.info("Lista '{}' compartilhada com '{}'", list.getName(), user.getProfileName());
		}
	}

	@Transactional(readOnly = true)
	public List<SharedListsDTO> findSharedLists() {

		User user = authService.getAuthenticatedUser();

		List<ListShare> shares = listShareRepository.findBySharedByIdOrSharedToId(user.getId(), user.getId());

		log.info("{} lista(s) compartilhada(s) encontrada(s)", shares.size());

		return shares.stream().map(share -> new SharedListsDTO(share, user)).toList();
	}

	private void validateListPermission(MovieList list, User user) {

	    boolean isOwner = list.getUser().getId().equals(user.getId());

	    boolean isSharedUser = list.getShares().stream()
	            .anyMatch(share -> share.getSharedTo().stream()
	                    .anyMatch(sharedUser -> sharedUser.getId().equals(user.getId()))
	            );

	    if (!isOwner && !isSharedUser) {
	        throw new RuntimeException("Você não tem permissão para alterar essa lista");
	    }
	}

}
