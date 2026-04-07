package com.gusmarg.tmetrage.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.gusmarg.tmetrage.entities.ListShare;
import com.gusmarg.tmetrage.entities.User;

@Repository
public interface ListShareRepository extends JpaRepository<ListShare, Long> {

    List<ListShare> findBySharedToId(Long userId);

    List<ListShare> findBySharedById(Long userId);

    @Query("""
            SELECT ls.list
            FROM ListShare ls
            WHERE ls.sharedBy.id = :userId
           """)
    List<ListShare> findListsSharedWithUser(Long userId);

	List<ListShare> findBySharedBy(User user);
	
	List<ListShare> findBySharedByIdOrSharedToId(Long sharedById, Long sharedToId);

}
