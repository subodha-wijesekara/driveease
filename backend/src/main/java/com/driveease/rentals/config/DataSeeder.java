package com.driveease.rentals.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final SeedingService seedingService;

    @Bean
    public CommandLineRunner seedData() {
        return args -> seedingService.performSeeding();
    }
}
