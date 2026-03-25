package com.gusmarg.tmetrage.entities;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class List {

	private Long id;
	private String name;
	private String description;
	private Instant createdAt;
	private Integer amountMovies;
	
}
