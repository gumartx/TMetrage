package com.gusmarg.tmetrage.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gusmarg.tmetrage.components.TMDBSaveData;
import com.gusmarg.tmetrage.dto.RatingFilterDTO;
import com.gusmarg.tmetrage.dto.RatingMovieDTO;
import com.gusmarg.tmetrage.dto.RatingUpdateDTO;
import com.gusmarg.tmetrage.dto.RatingResponseDTO;
import com.gusmarg.tmetrage.entities.Movie;
import com.gusmarg.tmetrage.entities.Rating;
import com.gusmarg.tmetrage.entities.User;
import com.gusmarg.tmetrage.entities.pk.RatingPK;
import com.gusmarg.tmetrage.repositories.MovieRepository;
import com.gusmarg.tmetrage.repositories.RatingRepository;
import com.gusmarg.tmetrage.services.utils.TMDBService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class RatingService {

	private final AuthService authService;
	private final RatingRepository ratingRepository;
	private final MovieRepository movieRepository;
	private final TMDBService tmdbService;

	@Transactional(readOnly = true)
	public RatingResponseDTO findMovieUserRating(Long movieId) {

		User user = authService.getAuthenticatedUser();

		Rating rating = ratingRepository.findByUserIdAndMovieId(user.getId(), movieId);

		log.info("Avaliação de usuário '{}' do filme '{}'", user.getProfileName(), movieId);

		return new RatingResponseDTO(rating);
	}

	@Transactional(readOnly = true)
	public List<RatingResponseDTO> findUserRatings(RatingFilterDTO filter) {

		User user = authService.getAuthenticatedUser();

		LocalDate startDate = null;
		LocalDate endDate = null;

		if (filter.getPeriod() != null) {

			LocalDate now = LocalDate.now();

			switch (filter.getPeriod()) {

			case LAST_WEEK -> startDate = now.minusWeeks(1);

			case LAST_MONTH -> startDate = now.minusMonths(1);

			case LAST_3_MONTHS -> startDate = now.minusMonths(3);

			case LAST_YEAR -> startDate = now.minusYears(1);

			case CUSTOM -> {
				startDate = filter.getStartDate();
				endDate = filter.getEndDate();
			}
			}

			if (endDate == null) {
				endDate = now;
			}
		}

		List<Rating> ratings = ratingRepository.findByFilters(user.getId(), filter.getPlatform(), filter.getScore(),
				startDate, endDate);

		log.info("Encontrado {} avaliação(ões)", ratings.size());

		return ratings.stream().map(RatingResponseDTO::new).toList();
	}

	@Transactional
	public RatingResponseDTO rateMovie(RatingMovieDTO dto) {

		User user = authService.getAuthenticatedUser();

		Movie movie = movieRepository.findById(dto.getMovieId()).orElseGet(() -> {
			return TMDBSaveData.saveMovieFromTMDB(dto.getMovieId(), tmdbService, movieRepository);
		});

		RatingPK id = new RatingPK(user, movie);

		Rating rating = new Rating();
		rating.setId(id);
		rating.setScore(dto.getRating());
		rating.setPlatform(dto.getPlatform());

		rating = ratingRepository.save(rating);

		log.info("Usuário '{}' avaliou filme '{}' com nota {}", user.getUsername(), movie.getId(), dto.getRating());

		return new RatingResponseDTO(rating);
	}

	@Transactional
	public RatingResponseDTO updateRating(Long movieId, RatingUpdateDTO dto) {

		User user = authService.getAuthenticatedUser();

		Movie movie = movieRepository.findById(movieId).orElseGet(() -> {
			return TMDBSaveData.saveMovieFromTMDB(movieId, tmdbService, movieRepository);
		});

		RatingPK id = new RatingPK(user, movie);

		Rating rating = ratingRepository.getReferenceById(id);
		rating.setScore(dto.getRating());
		rating.setPlatform(dto.getPlatform());

		rating = ratingRepository.save(rating);

		log.info("Usuário '{}' atualizou dados do filme '{}'", user.getUsername(), movie.getId());

		return new RatingResponseDTO(rating);
	}

	@Transactional
	public void removeRating(Long movieId) {

		User user = authService.getAuthenticatedUser();

		RatingPK id = new RatingPK();

		Movie movie = movieRepository.findById(movieId).orElseGet(() -> {
			return TMDBSaveData.saveMovieFromTMDB(movieId, tmdbService, movieRepository);
		});

		id.setUser(user);
		id.setMovie(movie);

		if (!ratingRepository.existsById(id)) {
			throw new RuntimeException("Usuário não tem avaliação nesse filme");
		}

		ratingRepository.deleteById(id);

		log.info("Usuário '{}' retirou avaliação do filme '{}'", user.getUsername(), movie.getId());
	}

}
