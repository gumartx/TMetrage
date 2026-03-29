package com.gusmarg.tmetrage.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MovieDTO {

	private Long id;
	private String title;
	private String imgUrl;
	private Integer amountScore;
	private Double score;

}
