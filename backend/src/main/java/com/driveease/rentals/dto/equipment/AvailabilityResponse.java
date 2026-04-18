package com.driveease.rentals.dto.equipment;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class AvailabilityResponse {

    private Long itemId;
    private String itemName;
    private LocalDate startDate;
    private LocalDate endDate;
    private int requestedQuantity;
    private int totalStock;
    private int bookedQuantity;
    private int availableQuantity;
    private boolean available;
}
