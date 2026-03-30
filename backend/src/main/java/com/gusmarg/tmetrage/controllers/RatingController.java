package com.gusmarg.tmetrage.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gusmarg.tmetrage.dto.RatingMovieDTO;
import com.gusmarg.tmetrage.dto.RatingPlatformDTO;
import com.gusmarg.tmetrage.dto.RatingResponseDTO;
import com.gusmarg.tmetrage.services.RatingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/avaliacoes")
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<RatingResponseDTO> rateMovie(@Valid @RequestBody RatingMovieDTO dto) {
    	RatingResponseDTO result = ratingService.rateMovie(dto);
        return ResponseEntity.ok(result);
    }
    
    @PatchMapping(value = "/{id}")
    public ResponseEntity<RatingResponseDTO> updatePlatform(@PathVariable Long id, @RequestBody RatingPlatformDTO dto) {
    	RatingResponseDTO result = ratingService.updatePlatform(id, dto);
        return ResponseEntity.ok(result);
    }
}
