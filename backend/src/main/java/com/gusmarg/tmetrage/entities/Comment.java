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
public class Comment {

	private Long id;
	private String message;
	private Integer likes;
	private Instant createdAt;
	
}
