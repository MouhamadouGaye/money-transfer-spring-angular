package com.mgaye.moneytransfer.repository;

import com.mgaye.moneytransfer.entity.TransactionEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TransactionEntryRepository extends JpaRepository<TransactionEntry, Long> {
    Optional<TransactionEntry> findFirstByUserIdAndPrevEntryIdIsNull(Long userId); // head

    Optional<TransactionEntry> findFirstByUserIdAndNextEntryIdIsNull(Long userId); // tail
}
