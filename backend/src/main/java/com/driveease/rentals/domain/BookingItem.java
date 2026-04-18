package com.driveease.rentals.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "booking_items", indexes = {
        @Index(name = "idx_bi_equipment", columnList = "equipment_item_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "equipment_item_id", nullable = false)
    private EquipmentItem equipmentItem;

    /**
     * Number of units of this equipment reserved in this booking.
     */
    @Column(nullable = false)
    @Builder.Default
    private int quantity = 1;

    /**
     * Snapshot of the daily_rate at the time of booking.
     * Preserves price integrity even if the rate changes later.
     */
    @Column(name = "unit_price_at_booking", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPriceAtBooking;
}
