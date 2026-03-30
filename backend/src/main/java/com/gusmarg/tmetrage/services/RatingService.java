package com.gusmarg.tmetrage.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gusmarg.tmetrage.dto.MovieDTO;
import com.gusmarg.tmetrage.dto.RatingFilterDTO;
import com.gusmarg.tmetrage.dto.RatingMovieDTO;
import com.gusmarg.tmetrage.dto.RatingPlatformDTO;
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
	public List<RatingResponseDTO> findUserRatings(RatingFilterDTO filter) {

		User user = authService.getAuthenticatedUser();

		LocalDate startDate = null;
		LocalDate endDate = null;

		if(filter.getPeriod() != null){

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

		    if(endDate == null){
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

			MovieDTO tmdbMovie = tmdbService.getMovieById(dto.getMovieId());
			Movie newMovie = new Movie();
			newMovie.setId(tmdbMovie.getId());
			return movieRepository.save(newMovie);
		});

		RatingPK id = new RatingPK(user, movie);

		Rating rating = new Rating();
		rating.setId(id);
		rating.setScore(dto.getScore());
		rating.setPlatform(dto.getPlatform());

		rating = ratingRepository.save(rating);

		log.info("Usuário '{}' avaliou filme '{}' com nota {}", user.getProfileName(), movie.getId(), dto.getScore());
		
		return new RatingResponseDTO(rating);
	}

	@Transactional
	public RatingResponseDTO updatePlatform(Long movieId, RatingPlatformDTO dto) {

		User user = authService.getAuthenticatedUser();

		Movie movie = movieRepository.findById(movieId).orElseGet(() -> {

			MovieDTO tmdbMovie = tmdbService.getMovieById(movieId);
			Movie newMovie = new Movie();
			newMovie.setId(tmdbMovie.getId());
			return movieRepository.save(newMovie);
		});
		
		RatingPK id = new RatingPK(user, movie);

		Rating rating = ratingRepository.getReferenceById(id);

		rating.setPlatform(dto.getPlatform());

		rating = ratingRepository.save(rating);

		log.info("Usuário '{}' atualizou plataforma '{}' no filme '{}'", user.getProfileName(), dto.getPlatform(), movie.getId());
		
		return new RatingResponseDTO(rating);
	}

}
