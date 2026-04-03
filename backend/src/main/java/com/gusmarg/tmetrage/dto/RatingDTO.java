package com.gusmarg.tmetrage.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RatingDTO {

	private Long movieId;
	private String movieTitle;
	private String posterPath;
	private Double rating;
	private LocalDate date;
	
}
