package com.gusmarg.tmetrage.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
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
@Table(name = "tb_genre")
public class Genre {

	@Id
	@Column(unique = true)
	private Long id;
	private String name;

	@ManyToMany(mappedBy = "genres")
	private List<Movie> movies = new ArrayList<>();

}
