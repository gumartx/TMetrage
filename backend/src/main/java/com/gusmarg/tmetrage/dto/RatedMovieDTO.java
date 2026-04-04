package com.gusmarg.tmetrage.dto;

import java.util.List;

import com.gusmarg.tmetrage.entities.Movie;
import com.gusmarg.tmetrage.entities.Rating;
import com.gusmarg.tmetrage.entities.enums.Platform;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RatedMovieDTO {

    private Long id;
    private String title;
    private String poster_path;
    private Double rating;
    private Platform platform;
    
    public RatedMovieDTO(Movie movie, List<Rating> ratings) {
    	id = movie.getId();
    	title = movie.getTitle();
    	poster_path = movie.getPosterPath();
    	rating = ratings.stream().filter(r -> r.getMovie().getId().equals(id)).map(Rating::getScore).findFirst().orElse(null);
    	platform = ratings.stream().filter(r -> r.getMovie().getId().equals(id)).map(Rating::getPlatform).findFirst().orElse(null);
    }

}
