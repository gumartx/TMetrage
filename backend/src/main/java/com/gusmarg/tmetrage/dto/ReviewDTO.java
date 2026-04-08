package com.gusmarg.tmetrage.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ReviewDTO {

	private Long id;
	private Long movieId;
	private String movieTitle;
	private String posterPath;
	private String content;
	private LocalDateTime date;
	
}
