package com.mgaye.moneytransfer.service;

import com.mgaye.moneytransfer.entity.*;
import com.mgaye.moneytransfer.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class TransferService {
    private final UserRepository userRepository;
    private final TransferRepository transferRepository;
    private final TransactionEntryRepository entryRepository;

    public TransferService(UserRepository userRepository,
            TransferRepository transferRepository,
            TransactionEntryRepository entryRepository) {
        this.userRepository = userRepository;
        this.transferRepository = transferRepository;
        this.entryRepository = entryRepository;
    }

    public Optional<User> getUser(Long id) {
        return userRepository.findById(id);
    }

    @Transactional
    public Transfer createTransfer(Long fromUserId, Long toUserId, BigDecimal amount) {
        User fromUser = userRepository.findById(fromUserId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User toUser = userRepository.findById(toUserId)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        if (fromUser.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        // Deduct and credit
        fromUser.setBalance(fromUser.getBalance().subtract(amount));
        toUser.setBalance(toUser.getBalance().add(amount));
        userRepository.save(fromUser);
        userRepository.save(toUser);

        // Save transfer
        Transfer transfer = Transfer.builder()
                .fromUser(fromUser)
                .toUser(toUser)
                .amount(amount)
                .status(Transfer.TransferStatus.COMPLETED)
                .createdAt(Instant.now())
                .build();
        transferRepository.save(transfer);

        // Add transaction entries for both users (doubly linked)
        TransactionEntry fromEntry = TransactionEntry.builder()
                .user(fromUser)
                .transfer(transfer)
                .createdAt(Instant.now())
                .prevEntryId(fromUser.getTailEntryId())
                .build();
        entryRepository.save(fromEntry);

        TransactionEntry toEntry = TransactionEntry.builder()
                .user(toUser)
                .transfer(transfer)
                .createdAt(Instant.now())
                .prevEntryId(toUser.getTailEntryId())
                .build();
        entryRepository.save(toEntry);

        // update linked list pointers
        fromUser.setTailEntryId(fromEntry.getId());
        toUser.setTailEntryId(toEntry.getId());
        if (fromUser.getHeadEntryId() == null)
            fromUser.setHeadEntryId(fromEntry.getId());
        if (toUser.getHeadEntryId() == null)
            toUser.setHeadEntryId(toEntry.getId());
        userRepository.save(fromUser);
        userRepository.save(toUser);

        return transfer;
    }

    public List<Transfer> getUserTransfers(Long userId) {
        return transferRepository.findByFromUser_IdOrToUser_Id(userId, userId);
    }
}
