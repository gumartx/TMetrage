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
        this.id = movie.getId();
        this.title = movie.getTitle();
        this.poster_path = movie.getPosterPath();

        Rating userRating = ratings.stream()
                                   .filter(r -> r.getMovie().getId().equals(id))
                                   .findFirst()
                                   .orElse(null);

        if (userRating != null) {
            this.rating = userRating.getScore();
            this.platform = userRating.getPlatform();
        } else {
            this.rating = null;
            this.platform = null;
        }
    }

    public RatedMovieDTO(Movie movie, Rating rating) {
        this.id = movie.getId();
        this.title = movie.getTitle();
        this.poster_path = movie.getPosterPath();

        if (rating != null) {
            this.rating = rating.getScore();
            this.platform = rating.getPlatform();
        }
    }

}
