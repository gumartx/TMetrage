package com.gusmarg.tmetrage.entities;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

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
@Table(name = "tb_user")
public class User implements UserDetails {
	private static final long serialVersionUID = 1L;
	
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
	private String avatar;
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
	
    @Transient
    public Integer getAmountFollowing() {
    	return following.size();
    }
    
    @Transient
    public Integer getAmountFollowers() {
    	return followers.size();
    }
    
    @Transient
    public Integer getAmountRatedMovies() {
    	return ratings.size();
    }
    
    @Transient
    public Integer getAmountComments() {
    	return comments.size();
    }
    
    @Transient
    public Integer getAmountLists() {
    	return lists.size();
    }
    
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return null;
	}

	@Override
	public String getUsername() {
		return email;
	}

}
