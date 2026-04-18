package com.driveease.rentals.dto.equipment;

import com.driveease.rentals.domain.enums.ItemCondition;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class EquipmentItemRequest {

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotBlank(message = "Item name is required")
    @Size(max = 150, message = "Name must not exceed 150 characters")
    private String name;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @NotNull(message = "Daily rate is required")
    @DecimalMin(value = "0.01", message = "Daily rate must be greater than 0")
    @Digits(integer = 8, fraction = 2, message = "Invalid price format")
    private BigDecimal dailyRate;

    @NotNull(message = "Total stock is required")
    @Min(value = 1, message = "Stock must be at least 1")
    private Integer totalStock;

    private ItemCondition itemCondition;

    @Size(max = 500, message = "Image URL must not exceed 500 characters")
    private String imageUrl;

    private Integer seats;

    @Size(max = 50, message = "Fuel type must not exceed 50 characters")
    private String fuelType;
}
