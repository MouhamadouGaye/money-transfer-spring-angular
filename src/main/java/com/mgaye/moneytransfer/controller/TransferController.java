package com.mgaye.moneytransfer.controller;

import com.mgaye.moneytransfer.dto.response.TransferResponseDto;
import com.mgaye.moneytransfer.dto.request.TransferRequestDto;
import com.mgaye.moneytransfer.entity.Transfer;
import com.mgaye.moneytransfer.entity.User;
import com.mgaye.moneytransfer.service.TransferService;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class TransferController {

    private final TransferService transferService;

    public TransferController(TransferService transferService) {
        this.transferService = transferService;
    }

    @PostMapping("/transfers")
    public ResponseEntity<Transfer> createTransfer(@RequestBody TransferRequestDto request) {
        Transfer transfer = transferService.createTransfer(
                request.getFromUserId(),
                request.getToUserId(),
                request.getAmount());
        return ResponseEntity.ok(transfer);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<Optional<User>> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(transferService.getUser(id));
    }

    @GetMapping("/transfers/user/{id}")
    public ResponseEntity<List<Transfer>> getTransfersByUser(@PathVariable Long id) {
        return ResponseEntity.ok(transferService.getUserTransfers(id));
    }
}
