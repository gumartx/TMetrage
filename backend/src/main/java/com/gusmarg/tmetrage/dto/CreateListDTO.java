package com.gusmarg.tmetrage.dto;

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
public class CreateListDTO {
	
	@NotBlank
	@Size(max = 50)
    private String name;
	@Size(max = 250)
	private String description;
    
}
