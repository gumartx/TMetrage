package com.gusmarg.tmetrage.repositories;

import java.time.LocalDate;
import java.util.List;

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

	List<Comment> findByMovieIdAndParentIsNullOrderByCreatedAtAsc(Long movieId);

	@Query("""
			    SELECT c FROM Comment c
			    WHERE (:search IS NULL
			           OR LOWER(c.message) LIKE LOWER(CONCAT('%', :search, '%'))
			           OR LOWER(c.movie.title) LIKE LOWER(CONCAT('%', :search, '%')))
			      AND (:startDate IS NULL OR c.createdAt >= :startDate)
			      AND (:endDate IS NULL OR c.createdAt <= :endDate)
			""")
	List<Comment> searchComments(String search, LocalDate startDate, LocalDate endDate);
}
