package com.driveease.rentals.repository;

import com.driveease.rentals.domain.EquipmentItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipmentItemRepository extends JpaRepository<EquipmentItem, Long> {

    Page<EquipmentItem> findByActiveTrueOrderByNameAsc(Pageable pageable);

    List<EquipmentItem> findByCategoryIdAndActiveTrue(Long categoryId);

    /**
     * Counts how many units of a given item are committed to non-cancelled/returned
     * bookings for a date range that overlaps with [requestedStart, requestedEnd].
     *
     * Overlap condition: A.start <= B.end AND A.end >= B.start
     */
    @Query("""
            SELECT COALESCE(SUM(bi.quantity), 0)
            FROM BookingItem bi
            JOIN bi.booking b
            WHERE bi.equipmentItem.id = :itemId
              AND b.status NOT IN (
                  com.driveease.rentals.domain.enums.BookingStatus.CANCELLED,
                  com.driveease.rentals.domain.enums.BookingStatus.RETURNED
              )
              AND b.rentalStartDate <= :requestedEnd
              AND b.rentalEndDate   >= :requestedStart
            """)
    int countBookedQuantity(
            @Param("itemId") Long itemId,
            @Param("requestedStart") java.time.LocalDate requestedStart,
            @Param("requestedEnd") java.time.LocalDate requestedEnd
    );
}
