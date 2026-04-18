package com.driveease.rentals.controller;

import com.driveease.rentals.dto.common.ApiResponse;
import com.driveease.rentals.dto.equipment.AvailabilityRequest;
import com.driveease.rentals.dto.equipment.AvailabilityResponse;
import com.driveease.rentals.dto.equipment.EquipmentItemRequest;
import com.driveease.rentals.dto.equipment.EquipmentItemResponse;
import com.driveease.rentals.service.AvailabilityService;
import com.driveease.rentals.service.EquipmentItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/equipment/items")
@RequiredArgsConstructor
@Tag(name = "Equipment Items", description = "Browse and manage rentable gear")
public class EquipmentItemController {

    private final EquipmentItemService itemService;
    private final AvailabilityService availabilityService;

    @GetMapping
    @Operation(summary = "List all active items — paginated (public)")
    public ResponseEntity<ApiResponse<Page<EquipmentItemResponse>>> findAll(
            @PageableDefault(size = 20, sort = "name") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(itemService.findAllActive(pageable)));
    }

    @GetMapping("/by-category/{categoryId}")
    @Operation(summary = "List items by category (public)")
    public ResponseEntity<ApiResponse<List<EquipmentItemResponse>>> findByCategory(
            @PathVariable Long categoryId) {
        return ResponseEntity.ok(ApiResponse.success(itemService.findByCategory(categoryId)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get item details by ID (public)")
    public ResponseEntity<ApiResponse<EquipmentItemResponse>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(itemService.findById(id)));
    }

    @GetMapping("/{id}/availability")
    @Operation(summary = "Check item availability for a date range (public)")
    public ResponseEntity<ApiResponse<AvailabilityResponse>> checkAvailability(
            @PathVariable Long id,
            @Valid @ModelAttribute AvailabilityRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success(availabilityService.checkAvailability(id, request)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add a new equipment item (Admin only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<EquipmentItemResponse>> create(
            @Valid @RequestBody EquipmentItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Equipment item created", itemService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an equipment item (Admin only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<EquipmentItemResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody EquipmentItemRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Equipment item updated", itemService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Soft-delete an equipment item (Admin only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        itemService.softDelete(id);
        return ResponseEntity.ok(ApiResponse.success("Equipment item deactivated"));
    }
}
