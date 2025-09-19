package com.mgaye.moneytransfer;

import java.security.SecureRandom;
import java.util.Base64;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MoneytransferApplication {

	public static void main(String[] args) {
		SpringApplication.run(MoneytransferApplication.class, args);

		// byte[] key = new byte[32]; // 256-bit key
		// new SecureRandom().nextBytes(key);
		// System.out.println(Base64.getEncoder().encodeToString(key));
	}

}
