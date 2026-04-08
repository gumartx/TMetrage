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
	private List<UsersRatingsDTO> ratings;
	private LocalDateTime sharedAt;
	private String direction;

	public SharedListsDTO(ListShare share, User user) {

	    this.id = share.getId();

	    boolean owner = share.getSharedBy().getId().equals(user.getId());

	    this.list = new MovieListResponseDTO(share.getList(), user, owner);

	    this.sharedBy = new UserSearchDTO(share.getSharedBy());

	    this.sharedTo = share.getSharedTo().stream()
	                          .map(UserSearchDTO::new)
	                          .toList();

	    this.sharedAt = share.getSharedAt();

	    this.direction = owner ? "sent" : "received";

	    this.ratings = share.getList().getMovies().stream()
	        .flatMap(movie -> this.sharedTo.stream().map(userDto -> {
	            User sharedUser = share.getSharedTo().stream()
	                                   .filter(u -> u.getProfileName().equals(userDto.getProfileName()))
	                                   .findFirst()
	                                   .orElse(null);
	            return new UsersRatingsDTO(sharedUser, movie);
	        }))
	        .toList();
	}
}