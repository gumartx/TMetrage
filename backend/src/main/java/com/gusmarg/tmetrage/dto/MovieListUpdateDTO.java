package com.gusmarg.tmetrage.dto;

import com.gusmarg.tmetrage.entities.MovieList;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MovieListUpdateDTO {

	@NotBlank
	@Size(max = 50)
    private String name;
	@Size(max = 250)
	private String description;
	private boolean isPublic = false;
	
	public MovieListUpdateDTO(MovieList entity) {
		name = entity.getName();
		description = entity.getDescription();
		isPublic = entity.isPublic();
	}
	
}
