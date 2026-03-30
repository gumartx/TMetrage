package com.gusmarg.tmetrage.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.gusmarg.tmetrage.entities.Rating;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RatingResponseDTO {

	private Long movieId;
    private Double score;
	@JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate createdAt;
    private String platform;
 

    public RatingResponseDTO(Rating rating) {
    	movieId = rating.getMovie().getId();
    	score = rating.getScore();
    	createdAt = rating.getCreatedAt();
    	platform = rating.getPlatform() != null ? rating.getPlatform().getNome() : null;
	}
    
}
