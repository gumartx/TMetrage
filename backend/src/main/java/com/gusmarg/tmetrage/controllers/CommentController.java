package com.gusmarg.tmetrage.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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

    @GetMapping(value = "/{movieId}")
    public ResponseEntity<List<CommentResponseDTO>> findAllMovieComments(@PathVariable Long movieId) {
        List<CommentResponseDTO> result = commentService.findAllMovieComments(movieId);
        return ResponseEntity.ok(result);
    }
    
    @PostMapping()
    public ResponseEntity<CommentResponseDTO> createComment(@RequestBody CommentCreateDTO dto) {
        CommentResponseDTO result = commentService.createComment(dto);
        return ResponseEntity.ok(result);
    }
    
    @PatchMapping("/{id}/curtir")
    public ResponseEntity<Void> likeComment(@PathVariable Long id) {
        commentService.likeComment(id);
        return ResponseEntity.noContent().build();
    }
}