package com.gusmarg.tmetrage.entities;

import java.time.Instant;

import com.gusmarg.tmetrage.entities.enums.Platform;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class Rating {

	private Double score;
	private Instant createdAt;
	private Platform platform;
	
}
