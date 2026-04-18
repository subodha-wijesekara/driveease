package com.driveease.rentals.service;

import com.driveease.rentals.domain.Booking;
import com.driveease.rentals.domain.BookingItem;
import com.driveease.rentals.domain.EquipmentItem;
import com.driveease.rentals.domain.User;
import com.driveease.rentals.domain.enums.BookingStatus;
import com.driveease.rentals.dto.booking.BookingItemRequest;
import com.driveease.rentals.dto.booking.BookingRequest;
import com.driveease.rentals.dto.booking.BookingResponse;
import com.driveease.rentals.dto.booking.BookingStatusUpdateRequest;
import com.driveease.rentals.exception.BookingConflictException;
import com.driveease.rentals.exception.InsufficientStockException;
import com.driveease.rentals.exception.ResourceNotFoundException;
import com.driveease.rentals.repository.BookingRepository;
import com.driveease.rentals.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final EquipmentItemService equipmentItemService;
    private final AvailabilityService availabilityService;

    /**
     * Creates a new booking for the authenticated customer.
     * Runs availability checks atomically within a SERIALIZABLE-safe transaction.
     */
    @Transactional
    public BookingResponse createBooking(Long customerId, BookingRequest request) {
        // Date validation
        if (request.getRentalEndDate().isBefore(request.getRentalStartDate())) {
            throw new BookingConflictException("Rental end date cannot be before start date.");
        }
        if (request.getRentalStartDate().isBefore(java.time.LocalDate.now())) {
            throw new BookingConflictException("Rental start date cannot be in the past.");
        }

        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", customerId));

        Booking booking = Booking.builder()
                .customer(customer)
                .rentalStartDate(request.getRentalStartDate())
                .rentalEndDate(request.getRentalEndDate())
                .status(BookingStatus.PENDING)
                .build();

        long rentalDays = ChronoUnit.DAYS.between(
                request.getRentalStartDate(), request.getRentalEndDate()) + 1;

        BigDecimal totalPrice = BigDecimal.ZERO;

        for (BookingItemRequest itemReq : request.getItems()) {
            EquipmentItem equipmentItem = equipmentItemService.getItemOrThrow(itemReq.getEquipmentItemId());

            if (!equipmentItem.isActive()) {
                throw new ResourceNotFoundException("EquipmentItem", "id", itemReq.getEquipmentItemId());
            }

            int available = availabilityService.getAvailableQuantity(
                    equipmentItem, request.getRentalStartDate(), request.getRentalEndDate());

            if (available < itemReq.getQuantity()) {
                throw new InsufficientStockException(
                        equipmentItem.getName(), itemReq.getQuantity(), available);
            }

            BookingItem bookingItem = BookingItem.builder()
                    .equipmentItem(equipmentItem)
                    .quantity(itemReq.getQuantity())
                    .unitPriceAtBooking(equipmentItem.getDailyRate())
                    .build();

            booking.addBookingItem(bookingItem);

            // price = dailyRate × qty × rentalDays
            BigDecimal lineTotal = equipmentItem.getDailyRate()
                    .multiply(BigDecimal.valueOf(itemReq.getQuantity()))
                    .multiply(BigDecimal.valueOf(rentalDays));
            totalPrice = totalPrice.add(lineTotal);
        }

        booking.setTotalPrice(totalPrice);
        Booking saved = bookingRepository.save(booking);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<BookingResponse> getMyBookings(Long customerId, BookingStatus status, Pageable pageable) {
        if (status != null) {
            return bookingRepository.findByCustomerIdAndStatusOrderByCreatedAtDesc(customerId, status, pageable)
                    .map(this::toResponse);
        }
        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customerId, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<BookingResponse> getAllBookings(Pageable pageable) {
        return bookingRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long bookingId, Long requesterId, boolean isAdmin) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        if (!isAdmin && !booking.getCustomer().getId().equals(requesterId)) {
            throw new AccessDeniedException("You do not have permission to view this booking.");
        }

        return toResponse(booking);
    }

    /**
     * Admin-only: update a booking's status and optionally add notes.
     */
    @Transactional
    public BookingResponse updateStatus(Long bookingId, BookingStatusUpdateRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        // Guard against invalid transitions (e.g., RETURNED → PENDING)
        validateStatusTransition(booking.getStatus(), request.getStatus());

        booking.setStatus(request.getStatus());
        if (request.getAdminNotes() != null) {
            booking.setAdminNotes(request.getAdminNotes());
        }

        return toResponse(bookingRepository.save(booking));
    }

    /**
     * Customer cancels their own booking. Only PENDING bookings can be cancelled.
     */
    @Transactional
    public BookingResponse cancelBooking(Long bookingId, Long customerId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        if (!booking.getCustomer().getId().equals(customerId)) {
            throw new AccessDeniedException("You do not have permission to cancel this booking.");
        }
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BookingConflictException(
                    "Only PENDING bookings can be cancelled. Current status: " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return toResponse(bookingRepository.save(booking));
    }

    // ---- private helpers ----

    private void validateStatusTransition(BookingStatus current, BookingStatus next) {
        // Simple guard: terminal states cannot be changed
        if (current == BookingStatus.RETURNED || current == BookingStatus.CANCELLED) {
            throw new BookingConflictException(
                    "Cannot change status of a " + current + " booking.");
        }
    }

    private BookingResponse toResponse(Booking booking) {
        long rentalDays = ChronoUnit.DAYS.between(
                booking.getRentalStartDate(), booking.getRentalEndDate()) + 1;

        List<BookingResponse.BookingItemResponse> itemResponses = booking.getBookingItems()
                .stream()
                .map(bi -> BookingResponse.BookingItemResponse.builder()
                        .id(bi.getId())
                        .equipmentItemId(bi.getEquipmentItem().getId())
                        .equipmentItemName(bi.getEquipmentItem().getName())
                        .quantity(bi.getQuantity())
                        .unitPriceAtBooking(bi.getUnitPriceAtBooking())
                        .lineTotal(bi.getUnitPriceAtBooking()
                                .multiply(BigDecimal.valueOf(bi.getQuantity()))
                                .multiply(BigDecimal.valueOf(rentalDays)))
                        .build())
                .toList();

        return BookingResponse.builder()
                .id(booking.getId())
                .customerId(booking.getCustomer().getId())
                .customerName(booking.getCustomer().getFullName())
                .customerEmail(booking.getCustomer().getEmail())
                .rentalStartDate(booking.getRentalStartDate())
                .rentalEndDate(booking.getRentalEndDate())
                .rentalDays((int) rentalDays)
                .status(booking.getStatus())
                .totalPrice(booking.getTotalPrice())
                .adminNotes(booking.getAdminNotes())
                .items(itemResponses)
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}
