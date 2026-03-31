package com.gusmarg.tmetrage.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.gusmarg.tmetrage.entities.Comment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CommentResponseDTO {
	
	private Long movieId;
	private Long userId;
	private String profileImg;
    private String message;
    private List<Long> likes;
    private LocalDateTime createdAt;
	private Long parentId;
    
	public CommentResponseDTO (Comment entity) {
		movieId = entity.getMovie().getId();
		userId = entity.getUser().getId();
		profileImg = entity.getUser().getProfileImgUrl();
		message = entity.getMessage();
		createdAt = entity.getCreatedAt();
    	parentId = entity.getParent() != null ? entity.getParent().getId() : null;
    	likes = entity.getLikes().stream().map(like -> like.getId()).toList();
	}
}
