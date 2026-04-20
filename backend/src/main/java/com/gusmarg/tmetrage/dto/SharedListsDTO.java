package com.gusmarg.tmetrage.dto;

import java.util.List;

import com.gusmarg.tmetrage.entities.MovieList;
import com.gusmarg.tmetrage.entities.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SharedListsDTO {

	private Long id;
	private MovieListResponseDTO list;
	private UserSearchDTO sharedBy;
	private List<UserSearchDTO> sharedTo;

	public SharedListsDTO(MovieList list, User currentUser) {

		this.id = list.getId();

		boolean owner = list.getUser().getId().equals(currentUser.getId());

		this.list = new MovieListResponseDTO(list, currentUser, owner);

		this.sharedBy = new UserSearchDTO(list.getUser().getId(), list.getUser().getName(),
				list.getUser().getProfileName(), list.getUser().getAvatar());

		this.sharedTo = list.getSharedTo().stream()
				.map(u -> new UserSearchDTO(u.getId(), u.getName(), u.getProfileName(), u.getAvatar())).toList();
	}

}