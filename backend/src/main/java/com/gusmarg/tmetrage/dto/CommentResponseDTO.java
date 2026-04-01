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
	
    private Long id;
    private Long movieId;
    private String author;
    private String content;
    private String profileImg;
    private LocalDateTime createdAt;
    private Integer likes;
    private Long parentId;
    
	public CommentResponseDTO (Comment entity) {
		id = entity.getId();
		movieId = entity.getMovie().getId();
		author = entity.getUser().getUsername();
		profileImg = entity.getUser().getAvatar();
		content = entity.getMessage();
		createdAt = entity.getCreatedAt();
    	parentId = entity.getParent() != null ? entity.getParent().getId() : null;
    	likes = entity.getAmountLikes();
	}
}
