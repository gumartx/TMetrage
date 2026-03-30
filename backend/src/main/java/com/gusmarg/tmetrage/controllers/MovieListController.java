package com.gusmarg.tmetrage.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.gusmarg.tmetrage.dto.CreateListDTO;
import com.gusmarg.tmetrage.dto.MovieDTO;
import com.gusmarg.tmetrage.dto.MovieListResponseDTO;
import com.gusmarg.tmetrage.dto.ShareListDTO;
import com.gusmarg.tmetrage.services.MovieListService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/listas")
public class MovieListController {

	private final MovieListService movieListService;

	@GetMapping()
	public ResponseEntity<List<MovieListResponseDTO>> findLists(@RequestParam(required = false) String nome,
			@RequestParam(required = false) Integer mes, @RequestParam(required = false) Integer ano) {
		List<MovieListResponseDTO> result = movieListService.findLists(nome, mes, ano);
		return ResponseEntity.ok(result);
	}

	@PostMapping()
	public ResponseEntity<MovieListResponseDTO> createList(@RequestBody @Valid CreateListDTO dto) {
		MovieListResponseDTO newDTO = movieListService.createList(dto);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(newDTO.getId()).toUri();
		return ResponseEntity.created(uri).body(newDTO);
	}

	@PostMapping("/{listId}/filmes")
	public ResponseEntity<MovieListResponseDTO> addMovie(@PathVariable Long listId, @RequestBody MovieDTO dto) {
		MovieListResponseDTO newDTO = movieListService.addMovieToList(listId, dto.getId());
		return ResponseEntity.ok(newDTO);
	}

	@DeleteMapping("/{listId}/filmes")
	public ResponseEntity<Void> removeMovie(@PathVariable Long listId, @RequestBody MovieDTO dto) {
		movieListService.removeMovieFromList(listId, dto.getId());
		return ResponseEntity.noContent().build();
	}

	@PostMapping("/{listId}/compartilhar")
	public ResponseEntity<Void> shareList(@PathVariable Long listId, @RequestBody ShareListDTO dto) {

		movieListService.shareList(listId, dto.getUserId());

		return ResponseEntity.ok().build();
	}
}
