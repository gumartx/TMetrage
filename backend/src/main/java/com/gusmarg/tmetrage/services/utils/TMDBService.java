package com.gusmarg.tmetrage.services.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.gusmarg.tmetrage.dto.MovieDTO;

@Service
public class TMDBService {

    @Value("${tmdb.api.key}")
    private String apiKey;

    @Value("${tmdb.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public MovieDTO getMovieById(Long movieId){

        String url = apiUrl + "/movie/" + movieId + "?api_key=" + apiKey + "&language=pt-BR";

        return restTemplate.getForObject(url, MovieDTO.class);
    }
}
