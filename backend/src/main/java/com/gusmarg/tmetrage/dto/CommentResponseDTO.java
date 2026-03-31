package com.gusmarg.tmetrage.dto;

import java.time.LocalDateTime;

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
	
	private Long commentId;
	private Long movieId;
	private Long userId;
	private String profileImg;
    private String message;
    private Integer likes;
    private LocalDateTime createdAt;
	private Long parentId;
    
	public CommentResponseDTO (Comment entity) {
		commentId = entity.getId();
		movieId = entity.getMovie().getId();
		userId = entity.getUser().getId();
		profileImg = entity.getUser().getProfileImgUrl();
		message = entity.getMessage();
		createdAt = entity.getCreatedAt();
    	parentId = entity.getParent() != null ? entity.getParent().getId() : null;
    	likes = entity.getAmountLikes();
	}
}
