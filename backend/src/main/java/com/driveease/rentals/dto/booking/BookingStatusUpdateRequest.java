package com.driveease.rentals.dto.booking;

import com.driveease.rentals.domain.enums.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private BookingStatus status;

    private String adminNotes;
}
