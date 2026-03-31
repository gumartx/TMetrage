package com.gusmarg.tmetrage.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CommentCreateDTO {
	
	@NotNull
	private Long movieId;
	@NotBlank
	@Size(max = 500)
    private String message;
	private Long parentId;
    
}
