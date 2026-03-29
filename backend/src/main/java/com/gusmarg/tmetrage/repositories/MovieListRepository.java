package com.gusmarg.tmetrage.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gusmarg.tmetrage.entities.MovieList;

@Repository
public interface MovieListRepository extends JpaRepository<MovieList, Long> {

}
