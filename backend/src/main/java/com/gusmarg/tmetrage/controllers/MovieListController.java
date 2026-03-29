package com.gusmarg.tmetrage.controllers;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.gusmarg.tmetrage.dto.AddMovieDTO;
import com.gusmarg.tmetrage.dto.CreateListDTO;
import com.gusmarg.tmetrage.dto.MovieListResponseDTO;
import com.gusmarg.tmetrage.services.MovieListService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/listas")
public class MovieListController {

	private final MovieListService movieListService;

	@PostMapping("{userId}")
	public ResponseEntity<MovieListResponseDTO> createList(@PathVariable Long userId, @RequestBody @Valid CreateListDTO dto) {
		MovieListResponseDTO newDTO = movieListService.createList(userId, dto);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(newDTO.getId()).toUri();
		return ResponseEntity.created(uri).body(newDTO);
	}

	@PostMapping("/{listId}/filmes")
	public ResponseEntity<MovieListResponseDTO> addMovie(@PathVariable Long listId, @RequestBody AddMovieDTO dto) {
		MovieListResponseDTO newDTO = movieListService.addMovieToList(listId, dto);
		return ResponseEntity.ok(newDTO);
	}
}
