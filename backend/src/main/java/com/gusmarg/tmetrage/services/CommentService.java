package com.gusmarg.tmetrage.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gusmarg.tmetrage.components.TMDBSaveData;
import com.gusmarg.tmetrage.dto.CommentCreateDTO;
import com.gusmarg.tmetrage.dto.CommentFilterDTO;
import com.gusmarg.tmetrage.dto.CommentResponseDTO;
import com.gusmarg.tmetrage.entities.Comment;
import com.gusmarg.tmetrage.entities.Movie;
import com.gusmarg.tmetrage.entities.User;
import com.gusmarg.tmetrage.repositories.CommentRepository;
import com.gusmarg.tmetrage.repositories.GenreRepository;
import com.gusmarg.tmetrage.repositories.MovieRepository;
import com.gusmarg.tmetrage.repositories.UserRepository;
import com.gusmarg.tmetrage.services.exceptions.ResourceNotFoundException;
import com.gusmarg.tmetrage.services.utils.TMDBService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class CommentService {

	private final TMDBService tmdbService;
	private final CommentRepository commentRepository;
	private final MovieRepository movieRepository;
	private final GenreRepository genreRepository;
	private final AuthService authService;
	private final UserRepository userRepository;

	@Transactional(readOnly = true)
	public List<CommentResponseDTO> findAllMovieComments(Long movieId) {

		User user = authService.getAuthenticatedUserOptional();

		List<Comment> result = commentRepository.findByMovieIdAndParentIsNullOrderByCreatedAtAsc(movieId)
				.orElseThrow(() -> new ResourceNotFoundException("Filme não contém comentário(s)"));

		log.info("{} comentário(s) no filme '{}'", result.size(), movieId);

		return result.stream().map(comment -> new CommentResponseDTO(comment, user)).toList();
	}

	@Transactional
	public CommentResponseDTO createComment(Long movieId, CommentCreateDTO dto) {

		User user = authService.getAuthenticatedUser();

		Movie movie = movieRepository.findById(movieId).orElseGet(() -> {
			return TMDBSaveData.saveMovieFromTMDB(movieId, tmdbService, movieRepository, genreRepository);
		});

		Comment comment = new Comment();
		comment.setMessage(dto.getContent());
		comment.setUser(user);
		comment.setMovie(movie);

		if (dto.getParentId() != null) {
			Comment parent = commentRepository.findById(dto.getParentId()).orElseThrow();
			comment.setParent(parent);

			log.info("Usuário '{}' respondeu comentário de '{}' no filme '{}'", user.getProfileName(),
					parent.getUser().getProfileName(), movie.getTitle());
		}

		comment = commentRepository.save(comment);

		log.info("Usuário '{}' publicou comentário no filme '{}'", user.getProfileName(), movie.getTitle());

		return new CommentResponseDTO(comment, user);
	}

	@Transactional
	public void toggleLike(Long commentId) {

		User user = authService.getAuthenticatedUser();

		Comment comment = commentRepository.getReferenceById(commentId);

		if (comment.getLikes().contains(user)) {

			comment.getLikes().remove(user);
			log.info("Usuário '{}' descurtiu o comentário '{}'", user.getProfileName(), comment.getId());

		} else {
			comment.getLikes().add(user);
			log.info("Usuário '{}' curtiu o comentário '{}'", user.getProfileName(), comment.getId());
		}

	}

	@Transactional
	public void deleteComment(Long commentId) {

		Comment comment = commentRepository.findById(commentId)
				.orElseThrow(() -> new RuntimeException("Comentário não encontrado"));

		User user = authService.getAuthenticatedUser();

		if (!comment.getUser().getId().equals(user.getId())) {
			throw new RuntimeException("Você não pode deletar esse comentário");
		}

		if (comment.getParent() != null) {
			Comment parent = commentRepository.getReferenceById(comment.getParent().getId());
			parent.getReplies().remove(comment);
		}


		log.info("Comentário '{}' de '{}' deletado", comment.getId(), user.getProfileName());
		
		commentRepository.delete(comment);
	}

	@Transactional(readOnly = true)
	public List<CommentResponseDTO> findUserComments(CommentFilterDTO filter) {

		User user = authService.getAuthenticatedUser();

		LocalDateTime start = filter.getStartDate() != null ? filter.getStartDate().atStartOfDay() : null;
		LocalDateTime end = filter.getEndDate() != null ? filter.getEndDate().atTime(23, 59, 59) : null;

		List<Comment> comments = commentRepository.searchComments(user.getId(), filter.getSearch(),
				start != null ? start.toLocalDate() : null, end != null ? end.toLocalDate() : null);

		log.info("'{}' comentário(s) de '{}'", comments.size(), user.getProfileName());
		
		return comments.stream().map(comment -> new CommentResponseDTO(comment, user)).collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public List<CommentResponseDTO> findUserComments(CommentFilterDTO filter, String profileName) {

		User user = userRepository.findByProfileName(profileName);

		LocalDateTime start = filter.getStartDate() != null ? filter.getStartDate().atStartOfDay() : null;
		LocalDateTime end = filter.getEndDate() != null ? filter.getEndDate().atTime(23, 59, 59) : null;

		List<Comment> comments = commentRepository.searchComments(user.getId(), filter.getSearch(),
				start != null ? start.toLocalDate() : null, end != null ? end.toLocalDate() : null);


		log.info("'{}' comentário(s) de '{}'", comments.size(), user.getProfileName());
		
		return comments.stream().map(comment -> new CommentResponseDTO(comment, user)).collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public List<CommentResponseDTO> getRecentComments(String profileName) {

		User user = userRepository.findByProfileName(profileName);

		List<Comment> comments = commentRepository.findTop5ByUserIdOrderByCreatedAtDesc(user.getId());

		log.info("Comentário(s) recente(s) de '{}'", user.getProfileName());
		
		return comments.stream().map(comment -> new CommentResponseDTO(comment, user)).toList();
	}

}
