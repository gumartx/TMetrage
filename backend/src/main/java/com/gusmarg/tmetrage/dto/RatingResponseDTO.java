package com.gusmarg.tmetrage.dto;

import java.time.LocalDate;

import com.gusmarg.tmetrage.entities.Rating;
import com.gusmarg.tmetrage.entities.enums.Platform;

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
    private Double rating;
    private LocalDate createdAt;
    private Platform platform;
 

    public RatingResponseDTO(Rating entity) {
    	movieId = entity.getMovie().getId();
    	rating = entity.getScore();
    	createdAt = entity.getCreatedAt();
    	platform = entity.getPlatform();
	}
    
}
