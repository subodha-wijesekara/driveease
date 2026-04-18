package com.driveease.rentals.repository;

import com.driveease.rentals.domain.Booking;
import com.driveease.rentals.domain.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Page<Booking> findByCustomerIdOrderByCreatedAtDesc(Long customerId, Pageable pageable);

    Page<Booking> findByCustomerIdAndStatusOrderByCreatedAtDesc(Long customerId, BookingStatus status, Pageable pageable);

    Page<Booking> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Booking> findByStatusOrderByCreatedAtDesc(BookingStatus status, Pageable pageable);

    /**
     * Finds all bookings that contain a specific equipment item.
     * Used for admin auditing (e.g., before deleting an item).
     */
    @Query("""
            SELECT DISTINCT b FROM Booking b
            JOIN b.bookingItems bi
            WHERE bi.equipmentItem.id = :itemId
            """)
    List<Booking> findAllByEquipmentItemId(@Param("itemId") Long itemId);

    /**
     * Count of active (non-cancelled, non-returned) bookings for a customer.
     */
    @Query("""
            SELECT COUNT(b) FROM Booking b
            WHERE b.customer.id = :customerId
              AND b.status NOT IN (
                  com.driveease.rentals.domain.enums.BookingStatus.CANCELLED,
                  com.driveease.rentals.domain.enums.BookingStatus.RETURNED
              )
            """)
    long countActiveBookingsByCustomer(@Param("customerId") Long customerId);
}
