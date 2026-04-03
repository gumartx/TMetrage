package com.gusmarg.tmetrage.repositories;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gusmarg.tmetrage.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	User findByEmail(String email);
	
	User findByProfileName(String profileName);
	
	@Query("""
		    SELECT u FROM User u
		    WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :value, '%'))
		       OR LOWER(u.profileName) LIKE LOWER(CONCAT('%', :value, '%'))
		""")
	List<User> searchUsers(@Param("value") String value);
	
	@Query("""
		    SELECT COUNT(u) > 0
		    FROM User u
		    JOIN u.following f
		    WHERE u.id = :followerId
		    AND f.id = :followingId
		""")
	boolean existsFollow(Long followerId, Long followingId);
	
    @Query("SELECT u.followers FROM User u WHERE u.id = :userId")
    Set<User> findFollowersByUserId(@Param("userId") Long userId);

    @Query("SELECT u.following FROM User u WHERE u.id = :userId")
    Set<User> findFollowingByUserId(@Param("userId") Long userId);
}
