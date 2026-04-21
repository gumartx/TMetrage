package com.gusmarg.tmetrage.dto;

import java.util.List;
import java.util.stream.Stream;

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
public class SharedListDetailDTO {

	private Long id;
	private MovieListResponseDTO list;
	private UserSearchDTO sharedBy;
	private List<UserSearchDTO> sharedTo;
	private List<UsersRatingsDTO> ratings;
	private String direction;

	public SharedListDetailDTO(MovieList share, User user) {
	    this.id = share.getId();

	    boolean owner = share.getUser().getId().equals(user.getId());

	    this.list = new MovieListResponseDTO(share, user, owner);
	    this.sharedBy = new UserSearchDTO(share.getUser());
	    this.sharedTo = share.getSharedTo()
	            .stream()
	            .map(UserSearchDTO::new)
	            .toList();

	    this.direction = owner ? "sent" : "received";

	    List<User> participants = Stream
	            .concat(Stream.of(share.getUser()), share.getSharedTo().stream())
	            .distinct()
	            .filter(u -> !u.getId().equals(user.getId()))
	            .toList();

	    this.ratings = share.getMovies().stream()
	            .flatMap(movie -> movie.getRatings().stream())
	            .filter(r -> r.getScore() != null)
	            .filter(r -> participants.stream()
	                    .anyMatch(p -> p.getId().equals(r.getUser().getId())))
	            .map(UsersRatingsDTO::new)
	            .toList();
	}
}