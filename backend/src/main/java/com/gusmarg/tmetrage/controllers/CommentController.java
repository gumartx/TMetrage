package com.gusmarg.tmetrage.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gusmarg.tmetrage.dto.CommentCreateDTO;
import com.gusmarg.tmetrage.dto.CommentResponseDTO;
import com.gusmarg.tmetrage.services.CommentService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/comentarios")
public class CommentController {

    private final CommentService commentService;

    @GetMapping(value = "/filme/{movieId}")
    public ResponseEntity<List<CommentResponseDTO>> getMovieComments(@PathVariable Long movieId) {
        List<CommentResponseDTO> result = commentService.findAllMovieComments(movieId);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping(value = "/{commentId}/respostas")
    public ResponseEntity<List<CommentResponseDTO>> getReplies(@PathVariable Long commentId) {
        List<CommentResponseDTO> result = commentService.getReplies(commentId);
        return ResponseEntity.ok(result);
    }
    
    @PostMapping()
    public ResponseEntity<CommentResponseDTO> createComment(@RequestBody CommentCreateDTO dto) {
        CommentResponseDTO result = commentService.createComment(dto);
        return ResponseEntity.ok(result);
    }
    
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{commentId}/curtir")
    public ResponseEntity<Void> toggleLike(@PathVariable Long commentId) {
        commentService.toggleLike(commentId);
        return ResponseEntity.noContent().build();
    }
    

}