package com.driveease.rentals.controller;

import com.driveease.rentals.dto.common.ApiResponse;
import com.driveease.rentals.dto.equipment.EquipmentCategoryRequest;
import com.driveease.rentals.dto.equipment.EquipmentCategoryResponse;
import com.driveease.rentals.service.EquipmentCategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/equipment/categories")
@RequiredArgsConstructor
@Tag(name = "Equipment Categories", description = "Manage gear categories")
public class EquipmentCategoryController {

    private final EquipmentCategoryService categoryService;

    @GetMapping
    @Operation(summary = "List all categories (public)")
    public ResponseEntity<ApiResponse<List<EquipmentCategoryResponse>>> findAll() {
        return ResponseEntity.ok(ApiResponse.success(categoryService.findAll()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a category by ID (public)")
    public ResponseEntity<ApiResponse<EquipmentCategoryResponse>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(categoryService.findById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new category (Admin only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<EquipmentCategoryResponse>> create(
            @Valid @RequestBody EquipmentCategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Category created", categoryService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a category (Admin only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<EquipmentCategoryResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody EquipmentCategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Category updated", categoryService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a category (Admin only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted"));
    }
}
