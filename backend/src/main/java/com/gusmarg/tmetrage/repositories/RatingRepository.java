package com.gusmarg.tmetrage.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.gusmarg.tmetrage.entities.Rating;
import com.gusmarg.tmetrage.entities.enums.Platform;
import com.gusmarg.tmetrage.entities.pk.RatingPK;

public interface RatingRepository extends JpaRepository<Rating, RatingPK> {

	Optional<Rating> findByIdUserIdAndIdMovieId(Long userId, Long movieId);

	@Query("""
			SELECT r
			FROM Rating r
			WHERE r.id.user.id = :userId
			AND (:platform IS NULL OR r.platform = :platform)
			AND (:score IS NULL OR r.score = :score)
			AND (:startDate IS NULL OR r.createdAt >= :startDate)
			AND (:endDate IS NULL OR r.createdAt <= :endDate)
			""")
	List<Rating> findByFilters(Long userId, Platform platform, Integer score, LocalDate startDate, LocalDate endDate);

	@Query("""
			SELECT AVG(r.score)
			FROM Rating r
			WHERE r.id.user.id = :userId
			""")
	Double findAvgScoreByUserId(Long userId);
	
}
