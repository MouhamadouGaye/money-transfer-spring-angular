package com.mgaye.moneytransfer.controller;

import com.mgaye.moneytransfer.dto.TransactionEntryDto;
import com.mgaye.moneytransfer.entity.TransactionEntry;
import com.mgaye.moneytransfer.service.TransactionEntryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/entries")
public class TransactionEntryController {
    private final TransactionEntryService entryService;

    public TransactionEntryController(TransactionEntryService entryService) {
        this.entryService = entryService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionEntryDto> getEntry(@PathVariable Long id) {
        return entryService.findById(id)
                .map(TransactionEntryDto::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}/head")
    public ResponseEntity<TransactionEntryDto> getUserHead(@PathVariable Long userId) {
        return entryService.findUserHead(userId)
                .map(TransactionEntryDto::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/user/{userId}/tail")
    public ResponseEntity<TransactionEntryDto> getUserTail(@PathVariable Long userId) {
        return entryService.findUserTail(userId)
                .map(TransactionEntryDto::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }
}
