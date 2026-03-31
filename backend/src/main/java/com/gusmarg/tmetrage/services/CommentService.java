package com.gusmarg.tmetrage.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gusmarg.tmetrage.components.TMDBSaveData;
import com.gusmarg.tmetrage.dto.CommentCreateDTO;
import com.gusmarg.tmetrage.dto.CommentResponseDTO;
import com.gusmarg.tmetrage.entities.Comment;
import com.gusmarg.tmetrage.entities.Movie;
import com.gusmarg.tmetrage.entities.User;
import com.gusmarg.tmetrage.repositories.CommentRepository;
import com.gusmarg.tmetrage.repositories.MovieRepository;
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
	private final AuthService authService;

	@Transactional
	public List<CommentResponseDTO> findAllMovieComments(Long movieId) {
		List<Comment> result = commentRepository.findByMovieIdAndParentIsNullOrderByCreatedAtDesc(movieId);
		
		return result.stream().map(CommentResponseDTO::new).toList();
	}

	@Transactional
	public CommentResponseDTO createComment(CommentCreateDTO dto) {

		User user = authService.getAuthenticatedUser();

		Movie movie = movieRepository.findById(dto.getMovieId()).orElseGet(() -> {
			return TMDBSaveData.saveMovieFromTMDB(dto.getMovieId(), tmdbService, movieRepository);
		});

		Comment comment = new Comment();
		comment.setMessage(dto.getMessage());
		comment.setUser(user);
		comment.setMovie(movie);

		if (dto.getParentId() != null) {
			Comment parent = commentRepository.getReferenceById(dto.getParentId());
			comment.setParent(parent);
		}

		comment = commentRepository.save(comment);

		log.info("Usuário '{}' publicou comentário no filme '{}'", user.getProfileName(), movie.getId());

		return new CommentResponseDTO(comment);
	}

	@Transactional
	public void likeComment(Long commentId) {

		User user = authService.getAuthenticatedUser();

		Comment comment = commentRepository.getReferenceById(commentId);

		comment.getLikes().add(user);
	}

}
