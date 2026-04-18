package com.driveease.rentals.dto.booking;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class BookingRequest {

    @NotNull(message = "Rental start date is required")
    private LocalDate rentalStartDate;

    @NotNull(message = "Rental end date is required")
    private LocalDate rentalEndDate;

    @NotEmpty(message = "At least one item is required")
    @Valid
    private List<BookingItemRequest> items;
}
