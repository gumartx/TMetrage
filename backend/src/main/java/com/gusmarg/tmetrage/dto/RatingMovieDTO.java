package com.gusmarg.tmetrage.dto;

import com.gusmarg.tmetrage.entities.enums.Platform;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RatingMovieDTO {

	@NotNull
    private Long movieId;
	@NotNull
	@Min(1)
	@Max(5)
    private Double score;
    private Platform platform;
    
}
