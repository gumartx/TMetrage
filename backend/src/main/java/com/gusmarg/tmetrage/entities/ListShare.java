package com.gusmarg.tmetrage.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_list_share")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListShare {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "list_id")
    private MovieList list;

    @ManyToOne
    @JoinColumn(name = "shared_by")
    private User sharedBy;

    @ManyToMany
    @JoinTable(
        name = "tb_list_share_users",
        joinColumns = @JoinColumn(name = "share_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> sharedTo = new ArrayList<>();;

    private LocalDateTime sharedAt;

    @PrePersist
    public void prePersist() {
        sharedAt = LocalDateTime.now();
    }
}
