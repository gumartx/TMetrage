package com.gusmarg.tmetrage.dto;

import java.util.List;

import com.gusmarg.tmetrage.entities.MovieList;
import com.gusmarg.tmetrage.entities.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SharedListsDTO {
	
	private Long id;
	private MovieListResponseDTO list;
	private String sharedBy;
	private List<ShareListDTO> sharedTo;
	private String sharedAt;


	public SharedListsDTO(MovieList list2, User user) {
		// TODO Auto-generated constructor stub
	}}
