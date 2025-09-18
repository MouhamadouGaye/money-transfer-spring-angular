package com.mgaye.moneytransfer.service;

import com.mgaye.moneytransfer.entity.TransactionEntry;
import com.mgaye.moneytransfer.repository.TransactionEntryRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TransactionEntryService {
    private final TransactionEntryRepository entryRepository;

    public TransactionEntryService(TransactionEntryRepository entryRepository) {
        this.entryRepository = entryRepository;
    }

    public Optional<TransactionEntry> findById(Long id) {
        return entryRepository.findById(id);
    }

    public Optional<TransactionEntry> findUserHead(Long userId) {
        return entryRepository.findFirstByUserIdAndPrevEntryIdIsNull(userId);
    }

    public Optional<TransactionEntry> findUserTail(Long userId) {
        return entryRepository.findFirstByUserIdAndNextEntryIdIsNull(userId);
    }
}
