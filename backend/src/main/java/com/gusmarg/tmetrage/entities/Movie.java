package com.gusmarg.tmetrage.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class Movie {

	private Long id;
	private String title;
	private String imgUrl;
	private Integer amountScore;
	private Double score;
	
}
