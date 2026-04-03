package com.gusmarg.tmetrage.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ReviewDTO {

	private Long movieId;
	private String movieTitle;
	private String posterPath;
	private String content;
	@JsonFormat(pattern = "dd/MM/yyyy")
	private LocalDateTime date;
	
}
