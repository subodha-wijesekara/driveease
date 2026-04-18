package com.driveease.rentals.service;

import com.driveease.rentals.domain.EquipmentItem;
import com.driveease.rentals.dto.equipment.AvailabilityRequest;
import com.driveease.rentals.dto.equipment.AvailabilityResponse;
import com.driveease.rentals.exception.BookingConflictException;
import com.driveease.rentals.exception.ResourceNotFoundException;
import com.driveease.rentals.repository.EquipmentItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AvailabilityService {

    private final EquipmentItemRepository itemRepository;

    /**
     * Checks how many units of the given item are available for the requested date range.
     *
     * The overlap algorithm: two intervals [A_start, A_end] and [B_start, B_end] overlap when:
     *   A_start <= B_end  AND  A_end >= B_start
     *
     * @param itemId  the equipment item to check
     * @param request contains startDate, endDate, quantity
     * @return AvailabilityResponse with full stock/booked/available breakdown
     */
    @Transactional(readOnly = true)
    public AvailabilityResponse checkAvailability(Long itemId, AvailabilityRequest request) {
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BookingConflictException("End date cannot be before start date.");
        }

        EquipmentItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("EquipmentItem", "id", itemId));

        if (!item.isActive()) {
            throw new ResourceNotFoundException("EquipmentItem", "id", itemId);
        }

        int bookedQty = itemRepository.countBookedQuantity(
                itemId,
                request.getStartDate(),
                request.getEndDate()
        );

        int availableQty = item.getTotalStock() - bookedQty;
        boolean isAvailable = availableQty >= request.getQuantity();

        return AvailabilityResponse.builder()
                .itemId(itemId)
                .itemName(item.getName())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .requestedQuantity(request.getQuantity())
                .totalStock(item.getTotalStock())
                .bookedQuantity(bookedQty)
                .availableQuantity(availableQty)
                .available(isAvailable)
                .build();
    }

    /**
     * Internal check used by BookingService during booking creation.
     * Throws InsufficientStockException if not enough units are free.
     */
    @Transactional(readOnly = true)
    public int getAvailableQuantity(EquipmentItem item,
                                     java.time.LocalDate startDate,
                                     java.time.LocalDate endDate) {
        int booked = itemRepository.countBookedQuantity(item.getId(), startDate, endDate);
        return item.getTotalStock() - booked;
    }
}
