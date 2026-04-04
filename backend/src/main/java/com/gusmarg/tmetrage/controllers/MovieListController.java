package com.gusmarg.tmetrage.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.gusmarg.tmetrage.dto.MovieDTO;
import com.gusmarg.tmetrage.dto.MovieListCreateDTO;
import com.gusmarg.tmetrage.dto.MovieListDetailsDTO;
import com.gusmarg.tmetrage.dto.MovieListResponseDTO;
import com.gusmarg.tmetrage.dto.MovieListUpdateDTO;
import com.gusmarg.tmetrage.dto.ShareListToDTO;
import com.gusmarg.tmetrage.dto.SharedListsDTO;
import com.gusmarg.tmetrage.services.MovieListService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/lists")
public class MovieListController {

	private final MovieListService movieListService;

	@GetMapping(value = "/{listId}")
	public ResponseEntity<MovieListDetailsDTO> findListById(@PathVariable Long listId) {
		MovieListDetailsDTO newDTO = movieListService.findById(listId);
		return ResponseEntity.ok(newDTO);
	}
	
	@GetMapping()
	public ResponseEntity<List<MovieListResponseDTO>> findLists(@RequestParam(required = false) String nome,
			@RequestParam(required = false) Integer mes, @RequestParam(required = false) Integer ano) {
		List<MovieListResponseDTO> result = movieListService.findLists(nome, mes, ano);
		return ResponseEntity.ok(result);
	}

	@PostMapping()
	public ResponseEntity<MovieListResponseDTO> createList(@RequestBody @Valid MovieListCreateDTO dto) {
		MovieListResponseDTO newDTO = movieListService.createList(dto);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(newDTO.getId()).toUri();
		return ResponseEntity.created(uri).body(newDTO);
	}

	@PutMapping(value = "/{listId}")
	public ResponseEntity<MovieListResponseDTO> updateList(@PathVariable Long listId, @Valid @RequestBody MovieListUpdateDTO dto) {
		MovieListResponseDTO newDTO = movieListService.updateList(listId, dto);
		return ResponseEntity.ok(newDTO);
	}
	
	@DeleteMapping("/{listId}")
	public ResponseEntity<Void> deleteList(@PathVariable Long listId) {
		movieListService.deleteList(listId);
		return ResponseEntity.noContent().build();
	}
	
	@PostMapping("/{listId}/movies")
	public ResponseEntity<Void> addMovie(@PathVariable Long listId, @RequestBody MovieDTO dto) {
		movieListService.addMovieToList(listId, dto.getId());
		return ResponseEntity.noContent().build();
	}

	@DeleteMapping("/{listId}/movies/{movieId}")
	public ResponseEntity<Void> removeMovie(@PathVariable Long listId, @PathVariable Long movieId) {
		movieListService.removeMovieFromList(listId, movieId);
		return ResponseEntity.noContent().build();
	}

	@PostMapping("/{listId}/share")
	public ResponseEntity<Void> shareList(@PathVariable Long listId, @RequestBody ShareListToDTO dto) {

		movieListService.shareList(listId, dto);

		return ResponseEntity.ok().build();
	}
	
	@GetMapping(value = "/shared")
	public ResponseEntity<List<SharedListsDTO>> getSharedLists(@RequestParam(required = false) String nome,
			@RequestParam(required = false) Integer mes, @RequestParam(required = false) Integer ano) {
		List<SharedListsDTO> result = movieListService.findSharedLists(nome, mes, ano);
		return ResponseEntity.ok(result);
	}
	
}
