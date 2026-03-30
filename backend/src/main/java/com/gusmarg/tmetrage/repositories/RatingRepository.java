package com.gusmarg.tmetrage.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gusmarg.tmetrage.entities.Rating;
import com.gusmarg.tmetrage.entities.pk.RatingPK;

public interface RatingRepository extends JpaRepository<Rating, RatingPK> {

    Optional<Rating> findByIdUserIdAndIdMovieId(Long userId, Long movieId);

}
