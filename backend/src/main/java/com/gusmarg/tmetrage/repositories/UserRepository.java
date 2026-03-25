package com.gusmarg.tmetrage.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.gusmarg.tmetrage.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {

	User findByEmail(String email);
	
	User findByProfileName(String profileName);
	
	@Query("""
		    SELECT u FROM User u
		    WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :value, '%'))
		       OR LOWER(u.profileName) LIKE LOWER(CONCAT('%', :value, '%'))
		""")
	List<User> searchUsers(@Param("value") String value);
}
