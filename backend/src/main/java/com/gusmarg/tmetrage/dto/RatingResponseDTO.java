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
 

    public RatingResponseDTO(Rating entity) {
    	movieId = entity.getMovie().getId();
    	score = entity.getScore();
    	createdAt = entity.getCreatedAt();
    	platform = entity.getPlatform() != null ? entity.getPlatform().getNome() : null;
	}
    
}
