package com.mgaye.moneytransfer.dto;

import com.mgaye.moneytransfer.entity.User;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String password;
    private BigDecimal balance;
    private Instant createdAt;

    public static UserDto fromEntity(User u) {
        UserDto d = new UserDto();
        d.setId(u.getId());
        d.setUsername(u.getUsername());
        d.setEmail(u.getEmail());
        d.setBalance(u.getBalance());
        d.setCreatedAt(u.getCreatedAt());
        return d;
    }
}
