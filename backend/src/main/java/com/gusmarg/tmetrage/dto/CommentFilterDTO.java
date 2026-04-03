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
public class CommentFilterDTO {

	private String search;
	private LocalDate startDate;
	private LocalDate endDate;
}