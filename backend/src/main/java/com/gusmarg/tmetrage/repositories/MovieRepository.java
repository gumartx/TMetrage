package com.gusmarg.tmetrage.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gusmarg.tmetrage.entities.Movie;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

}
