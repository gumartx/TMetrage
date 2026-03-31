package com.gusmarg.tmetrage.controllers;

import org.springframework.http.ResponseEntity;
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

    @PostMapping
    public ResponseEntity<CommentResponseDTO> createComment(@RequestBody CommentCreateDTO dto) {
        CommentResponseDTO result = commentService.createComment(dto);
        return ResponseEntity.ok(result);
    }
}