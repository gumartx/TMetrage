package com.gusmarg.tmetrage.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gusmarg.tmetrage.dto.RatedMovieDTO;
import com.gusmarg.tmetrage.dto.RatingFilterDTO;
import com.gusmarg.tmetrage.dto.RatingMovieDTO;
import com.gusmarg.tmetrage.dto.RatingResponseDTO;
import com.gusmarg.tmetrage.dto.RatingUpdateDTO;
import com.gusmarg.tmetrage.dto.enums.Period;
import com.gusmarg.tmetrage.entities.enums.Platform;
import com.gusmarg.tmetrage.services.RatingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/ratings")
public class RatingController {

	private final RatingService ratingService;

	@GetMapping("/{profileName}/recent")
	public ResponseEntity<List<RatingResponseDTO>> getRecentRatings(@PathVariable String profileName) {
		return ResponseEntity.ok(ratingService.getRecentRatings(profileName));
	}

	@GetMapping(value = "{movieId}")
	public ResponseEntity<RatingResponseDTO> getMovieUserRating(@PathVariable Long movieId) {
		RatingResponseDTO result = ratingService.findMovieUserRating(movieId);
		return ResponseEntity.ok(result);
	}

	@GetMapping(value = "/{listId}/lists")
	public ResponseEntity<List<RatedMovieDTO>> getRatedMovieList(@PathVariable Long listId) {
		List<RatedMovieDTO> result = ratingService.getRatedMovies(listId);
		return ResponseEntity.ok(result);
	}

	@GetMapping
	public ResponseEntity<Page<RatingResponseDTO>> getUserRatings(@RequestParam(required = false) String title, @RequestParam(required = false) Platform platform,
			@RequestParam(required = false) Integer score, @RequestParam(required = false) Period period,
			@RequestParam(required = false) Long genreId, @RequestParam(required = false) LocalDate startDate,
			@RequestParam(required = false) LocalDate endDate, Pageable pageable) {

		RatingFilterDTO filter = new RatingFilterDTO(title, platform, score, period, genreId, startDate, endDate);

		Page<RatingResponseDTO> result = ratingService.findUserRatings(filter, pageable);
		return ResponseEntity.ok(result);
	}

	@GetMapping("/public/{profileName}")
	public ResponseEntity<Page<RatingResponseDTO>> getUserRatingsByProfileName(@RequestParam(required = false) String title,@PathVariable String profileName,
			@RequestParam(required = false) Platform platform, @RequestParam(required = false) Integer score,
			@RequestParam(required = false) Long genreId, @RequestParam(required = false) Period period,
			@RequestParam(required = false) LocalDate startDate, @RequestParam(required = false) LocalDate endDate,
			Pageable pageable) {

		RatingFilterDTO filter = new RatingFilterDTO(title, platform, score, period, genreId, startDate, endDate);

		Page<RatingResponseDTO> result = ratingService.findUserRatingsByProfileName(profileName, filter, pageable);
		return ResponseEntity.ok(result);
	}

	@PostMapping()
	public ResponseEntity<RatingResponseDTO> rateMovie(@Valid @RequestBody RatingMovieDTO dto) {
		RatingResponseDTO result = ratingService.rateMovie(dto);
		return ResponseEntity.ok(result);
	}

	@PutMapping(value = "/{movieId}")
	public ResponseEntity<RatingResponseDTO> updateRating(@PathVariable Long movieId,
			@RequestBody RatingUpdateDTO dto) {
		RatingResponseDTO result = ratingService.updateRating(movieId, dto);
		return ResponseEntity.ok(result);
	}

	@DeleteMapping(value = "/{movieId}")
	public ResponseEntity<Void> removeRating(@PathVariable Long movieId) {
		ratingService.removeRating(movieId);
		return ResponseEntity.noContent().build();
	}

}
