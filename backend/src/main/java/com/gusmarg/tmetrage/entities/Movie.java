package com.gusmarg.tmetrage.entities;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "tb_movie")
public class Movie {

	@Id
	@Column(unique = true)
	private Long id;
	private String title;
	private String posterPath;

	@ManyToMany(mappedBy = "favoriteMovies")
	private Set<User> users = new HashSet<>();
	
	@ManyToMany
	@JoinTable(name = "tb_movie_genre", joinColumns = @JoinColumn(name = "movie_id"), inverseJoinColumns = @JoinColumn(name = "genre_id"))
	private List<Genre> genres = new ArrayList<>();

	@OneToMany(mappedBy = "id.movie")
	private Set<Rating> ratings = new HashSet<>();

	@OneToMany(mappedBy = "movie", cascade = CascadeType.ALL)
	private List<Comment> comments = new ArrayList<>();

	@ManyToMany(mappedBy = "movies")
	private Set<MovieList> lists = new HashSet<>();
}
