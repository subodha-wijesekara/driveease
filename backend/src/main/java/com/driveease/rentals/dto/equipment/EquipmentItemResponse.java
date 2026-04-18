package com.driveease.rentals.dto.equipment;

import com.driveease.rentals.domain.enums.ItemCondition;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class EquipmentItemResponse {

    private Long id;
    private Long categoryId;
    private String categoryName;
    private String name;
    private String description;
    private BigDecimal dailyRate;
    private int totalStock;
    private ItemCondition itemCondition;
    private String imageUrl;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer seats;
    private String fuelType;
}
