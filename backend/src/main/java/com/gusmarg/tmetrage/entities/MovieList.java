package com.gusmarg.tmetrage.entities;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "tb_list")
public class MovieList {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false)
	private String name;
	private String description;
	private LocalDate createdAt;
	@Column(nullable = false)
    private boolean isPublic = false;
	
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;
	
	@OneToMany(mappedBy = "list", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<ListShare> shares = new HashSet<>();
	
	@ManyToMany
	@JoinTable(
	    name = "tb_list_movie",
	    joinColumns = @JoinColumn(name = "list_id"),
	    inverseJoinColumns = @JoinColumn(name = "movie_id")
	)
	private Set<Movie> movies = new HashSet<>();
	
    @PrePersist
    public void setCreationDate() {
        createdAt = LocalDate.now();
    }
    
    @Transient
    public Integer getAmountMovies() {
    	return movies.size();
    }
}
