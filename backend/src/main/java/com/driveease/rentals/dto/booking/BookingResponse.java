package com.driveease.rentals.dto.booking;

import com.driveease.rentals.domain.enums.BookingStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class BookingResponse {

    private Long id;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private LocalDate rentalStartDate;
    private LocalDate rentalEndDate;
    private int rentalDays;
    private BookingStatus status;
    private BigDecimal totalPrice;
    private String adminNotes;
    private List<BookingItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    public static class BookingItemResponse {
        private Long id;
        private Long equipmentItemId;
        private String equipmentItemName;
        private int quantity;
        private BigDecimal unitPriceAtBooking;
        private BigDecimal lineTotal;
    }
}
