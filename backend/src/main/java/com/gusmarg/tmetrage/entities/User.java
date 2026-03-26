package com.gusmarg.tmetrage.entities;

import java.util.List;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
@Table(name = "tb_user")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false)
	private String name;
	@Column(unique = true, nullable = false)
	private String profileName;
	@Column(unique = true, nullable = false)
	private String email;
	private String bio;
	@Column(nullable = false)
	private String password;
	private Integer amountFollowing = 0;
	private Integer amountFollowers = 0;
	private String profileImgUrl;
	private String backgroundImgUrl;

	@OneToMany(mappedBy = "user")
	private List<MovieList> lists = new ArrayList<>();
	
	@OneToMany(mappedBy = "id.user")
	private Set<Rating> ratings = new HashSet<>();

	@OneToMany(mappedBy = "user")
	private List<Comment> comments = new ArrayList<>();
	
	@ManyToMany
	@JoinTable(name = "tb_follow", joinColumns = @JoinColumn(name = "follower_id"), inverseJoinColumns = @JoinColumn(name = "following_id"))
	private Set<User> following = new HashSet<>();

	@ManyToMany(mappedBy = "following")
	private Set<User> followers = new HashSet<>();
}
