package com.gusmarg.tmetrage.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.gusmarg.tmetrage.entities.ListShare;
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
	private LocalDateTime sharedAt;
	private String direction;

	public SharedListsDTO(ListShare share, User user) {

		this.id = share.getId();

		boolean owner = share.getSharedBy().getId().equals(user.getId());

		this.list = new MovieListResponseDTO(share.getList(), user, owner);

		this.sharedBy = new UserSearchDTO(share.getSharedBy());

		this.sharedTo = List.of(new UserSearchDTO(share.getSharedTo()));

		this.sharedAt = share.getSharedAt();

		this.direction = owner ? "sent" : "received";
	}
}