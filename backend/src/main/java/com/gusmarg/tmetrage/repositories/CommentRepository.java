package com.gusmarg.tmetrage.repositories;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.gusmarg.tmetrage.entities.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

	List<Comment> findByMovieIdAndParentIsNullOrderByCreatedAtDesc(Long movieId);

	List<Comment> findByParentIdOrderByCreatedAtAsc(Long parentId);

	Comment findByUserIdAndId(Long userId, Long commentId);

	List<Comment> findByMovieIdOrderByCreatedAtAsc(Long movieId);

	Optional<List<Comment>> findByMovieIdAndParentIsNullOrderByCreatedAtAsc(Long movieId);

	@Query("""
			SELECT c
			FROM Comment c
			JOIN c.movie m
			WHERE c.user.id = :userId
			AND (
			    :search IS NULL OR
			    c.message ILIKE :search OR
			    m.title ILIKE :search
			)
			AND c.createdAt >= COALESCE(:startDate, c.createdAt)
			AND c.createdAt <= COALESCE(:endDate, c.createdAt)
			""")
	List<Comment> searchComments(Long userId, String search, LocalDate startDate, LocalDate endDate);

	List<Comment> findByCreatedAtAfterOrderByCreatedAtDesc(LocalDateTime twoDaysAgo);

	List<Comment> findTop5ByUserIdOrderByCreatedAtDesc(Long id);
}
