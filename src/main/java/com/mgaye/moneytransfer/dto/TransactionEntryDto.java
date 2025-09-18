package com.mgaye.moneytransfer.dto;

import com.mgaye.moneytransfer.entity.TransactionEntry;
import lombok.Data;

import java.time.Instant;

@Data
public class TransactionEntryDto {
    private Long id;
    private Long userId;
    private Long transferId;
    private Long prevEntryId;
    private Long nextEntryId;
    private Instant createdAt;

    public static TransactionEntryDto fromEntity(TransactionEntry e) {
        TransactionEntryDto d = new TransactionEntryDto();
        d.setId(e.getId());
        d.setUserId(e.getUser().getId());
        d.setTransferId(e.getTransfer().getId());
        d.setPrevEntryId(e.getPrevEntryId());
        d.setNextEntryId(e.getNextEntryId());
        d.setCreatedAt(e.getCreatedAt());
        return d;
    }
}
