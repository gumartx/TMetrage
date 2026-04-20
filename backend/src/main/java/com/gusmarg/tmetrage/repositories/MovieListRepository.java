package com.gusmarg.tmetrage.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.gusmarg.tmetrage.entities.MovieList;

@Repository
public interface MovieListRepository extends JpaRepository<MovieList, Long> {

	@Query("""
			SELECT l
			FROM MovieList l
			WHERE l.user.id = :userId
			AND (:name IS NULL OR LOWER(l.name) LIKE LOWER(CONCAT('%', :name, '%')))
			AND (:month IS NULL OR MONTH(l.createdAt) = :month)
			AND (:year IS NULL OR YEAR(l.createdAt) = :year)
			""")
	List<MovieList> searchUserLists(Long userId, String name, Integer month, Integer year);

	@Query("""
			SELECT l
			FROM MovieList l
			WHERE l.user.id = :userId
			AND l.id = :listId
			""")
	MovieList findByListId(Long listId, Long userId);

	@Query("""
			SELECT DISTINCT l
			FROM MovieList l
			LEFT JOIN ListShare s ON s.list.id = l.id
			LEFT JOIN s.sharedTo u
			WHERE l.id = :listId
			AND (l.user.id = :userId OR u.id = :userId)
			""")
	Optional<MovieList> findAccessibleList(Long listId, Long userId);

	@Query("""
			SELECT DISTINCT l
			FROM MovieList l
			WHERE l.id = :listId
			AND (l.user.id = :userId)
			AND l.isPublic = true
			""")
	Optional<MovieList> findPublicListByUser(Long listId, Long userId);

	@Query("""
			SELECT l
			FROM MovieList l
			WHERE l.user.id = :userId
			AND l.isPublic = true
			AND (:name IS NULL OR LOWER(l.name) LIKE LOWER(CONCAT('%', :name, '%')))
			AND (:month IS NULL OR MONTH(l.createdAt) = :month)
			AND (:year IS NULL OR YEAR(l.createdAt) = :year)
			""")
	List<MovieList> findPublicListsByUser(Long userId, String name, Integer month, Integer year);

	@Query("""
			    SELECT DISTINCT l
			    FROM MovieList l
			    LEFT JOIN l.sharedTo s
			    WHERE l.user.id = :userId
			    OR s.id = :userId
			""")
	List<MovieList> findByUserIdOrSharedToId(Long userId);

	@Query("""
			   SELECT DISTINCT l
			   FROM MovieList l
			   LEFT JOIN FETCH l.user
			   LEFT JOIN FETCH l.sharedTo
			   LEFT JOIN FETCH l.movies
			   WHERE l.user.id = :userId
			      OR EXISTS (
			          SELECT 1 FROM l.sharedTo s WHERE s.id = :userId
			      )
			""")
	List<MovieList> findSharedLists(Long userId);

	@Query("""
			    SELECT DISTINCT l
			    FROM MovieList l
			    LEFT JOIN l.sharedTo s
			    WHERE l.isShared = true
			      AND (l.user.id = :userId OR s.id = :userId)
			""")
	List<MovieList> findSharedListsByUser(Long userId);

	@Query("""
			    SELECT DISTINCT l
			    FROM MovieList l
			    LEFT JOIN FETCH l.sharedTo
			    LEFT JOIN FETCH l.movies
			    JOIN FETCH l.user
			    WHERE l.id = :listId
			    AND (
			        l.user.id = :userId
			        OR EXISTS (
			            SELECT 1
			            FROM MovieList l2
			            JOIN l2.sharedTo s2
			            WHERE l2.id = l.id
			            AND s2.id = :userId
			        )
			    )
			""")
	Optional<MovieList> findSharedListDetail(Long listId, Long userId);

}
