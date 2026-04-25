package com.gusmarg.tmetrage.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.gusmarg.tmetrage.entities.Rating;
import com.gusmarg.tmetrage.entities.User;
import com.gusmarg.tmetrage.entities.enums.Platform;
import com.gusmarg.tmetrage.entities.pk.RatingPK;

public interface RatingRepository extends JpaRepository<Rating, RatingPK> {

	List<Rating> findTop8ByIdUserOrderByCreatedAtDesc(User user);

	Optional<Rating> findByIdUserIdAndIdMovieId(Long userId, Long movieId);

	@Query("""
			SELECT DISTINCT r
			FROM Rating r
			JOIN r.id.movie m
			JOIN m.genres g
			WHERE r.id.user.id = :userId
			AND (:title IS NULL OR m.title ILIKE CONCAT('%', CAST(:title AS string), '%'))
			AND (:platform IS NULL OR r.platform = :platform)
			AND (:score IS NULL OR r.score = :score)
			AND (:genreId IS NULL OR g.id = :genreId)
			AND r.createdAt >= COALESCE(:startDate, r.createdAt)
			AND r.createdAt <= COALESCE(:endDate, r.createdAt)
			""")
	Page<Rating> findByFilters(Long userId, String title, Platform platform, Integer score, Long genreId,
			LocalDate startDate, LocalDate endDate, Pageable pageable);

	@Query("""
			SELECT AVG(r.score)
			FROM Rating r
			WHERE r.id.user.id = :userId
			""")
	Double findAvgScoreByUserId(Long userId);

	List<Rating> findByIdUserIdAndIdMovieIdIn(Long userId, List<Long> movieIds);

}
