package com.mgaye.moneytransfer.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "transaction_entries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // owner of this entry (whose history)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // the canonical transfer that this entry refers to
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transfer_id", nullable = false)
    private Transfer transfer;

    // doubly linked list pointers (store IDs for simplicity & to avoid cycles in
    // JPA)
    @Column(name = "prev_entry_id")
    private Long prevEntryId;

    @Column(name = "next_entry_id")
    private Long nextEntryId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}
