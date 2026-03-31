package com.gusmarg.tmetrage.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gusmarg.tmetrage.entities.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

	List<Comment> findByMovieIdAndParentIsNullOrderByCreatedAtDesc(Long movieId);
	
}
