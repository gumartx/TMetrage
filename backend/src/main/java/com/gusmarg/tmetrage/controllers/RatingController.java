package com.gusmarg.tmetrage.controllers;

import java.time.LocalDate;
import java.util.List;

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
	
	
	@GetMapping()
	public ResponseEntity<List<RatingResponseDTO>> getUserRatings(@RequestParam(required = false) Platform plataforma,
			@RequestParam(required = false) Integer nota, @RequestParam(required = false) Period periodo,
			@RequestParam(required = false) LocalDate inicio, @RequestParam(required = false) LocalDate fim) {

		RatingFilterDTO filter = new RatingFilterDTO(plataforma, nota, periodo, inicio, fim);
		
		List<RatingResponseDTO> result = ratingService.findUserRatings(filter);
		return ResponseEntity.ok(result);
	}
	
	@GetMapping("/public/{profileName}")
	public ResponseEntity<List<RatingResponseDTO>> getUserRatingsByProfileName(@PathVariable String profileName, @RequestParam(required = false) Platform plataforma,
			@RequestParam(required = false) Integer nota, @RequestParam(required = false) Period periodo,
			@RequestParam(required = false) LocalDate inicio, @RequestParam(required = false) LocalDate fim) {

		RatingFilterDTO filter = new RatingFilterDTO(plataforma, nota, periodo, inicio, fim);
		
		List<RatingResponseDTO> result = ratingService.findUserRatingsByProfileName(profileName, filter);
		return ResponseEntity.ok(result);
	}

	@PostMapping()
	public ResponseEntity<RatingResponseDTO> rateMovie(@Valid @RequestBody RatingMovieDTO dto) {
		RatingResponseDTO result = ratingService.rateMovie(dto);
		return ResponseEntity.ok(result);
	}
	
	@PutMapping(value = "/{movieId}")
	public ResponseEntity<RatingResponseDTO> updateRating(@PathVariable Long movieId, @RequestBody RatingUpdateDTO dto) {
		RatingResponseDTO result = ratingService.updateRating(movieId, dto);
		return ResponseEntity.ok(result);
	}
	
	@DeleteMapping(value = "/{movieId}")
	public ResponseEntity<Void> removeRating(@PathVariable Long movieId) {
	    ratingService.removeRating(movieId);
	    return ResponseEntity.noContent().build();
	}

}
