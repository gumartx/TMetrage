package com.gusmarg.tmetrage.dto;

import com.gusmarg.tmetrage.entities.Rating;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UsersRatingsDTO {

    private Long movieId;
    private String profileName;
    private String avatar;
    private Double rating;

    public UsersRatingsDTO(Rating entity) {
        movieId = entity.getMovie().getId();
        profileName = entity.getUser().getProfileName();
        avatar = entity.getUser().getAvatar();
        rating = entity.getScore();
    }
}