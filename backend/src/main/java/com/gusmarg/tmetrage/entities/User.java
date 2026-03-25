package com.gusmarg.tmetrage.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class User {

	private Long id;
	private String name;
	private String profileName;
	private String email;
	private String senha;
	private Integer followed;
	private Integer followers;
	private String profileImgUrl;
	private String backgroundImgUrl;
	
	
}
