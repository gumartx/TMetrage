package com.gusmarg.tmetrage.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.gusmarg.tmetrage.entities.Comment;
import com.gusmarg.tmetrage.entities.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CommentResponseDTO {

	private Long id;
	private Long movieId;
	private String movieTitle;
	private String posterPath;
	private String author;
	private String content;
	private String avatar;
	private boolean likedByMe;
	private LocalDateTime createdAt;
	private int likes;
	private Long parentId;
	private List<CommentResponseDTO> replies;

	public CommentResponseDTO(Comment entity, User currentUser) {
		id = entity.getId();
		movieId = entity.getMovie().getId();
		movieTitle = entity.getMovie().getTitle();
		posterPath = entity.getMovie().getPosterPath();
		author = entity.getUser().getProfileName();
		avatar = entity.getUser().getAvatar();
		content = entity.getMessage();
		likedByMe = currentUser != null
				&& entity.getLikes().stream().anyMatch(user -> user.getId().equals(currentUser.getId()));
		createdAt = entity.getCreatedAt();
		parentId = entity.getParent() != null ? entity.getParent().getId() : null;
		likes = entity.getAmountLikes();
		replies = entity.getReplies().stream().map(reply -> new CommentResponseDTO(reply, currentUser)).toList();
	}

}
