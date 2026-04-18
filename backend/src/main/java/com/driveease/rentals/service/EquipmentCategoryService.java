package com.driveease.rentals.service;

import com.driveease.rentals.domain.EquipmentCategory;
import com.driveease.rentals.dto.equipment.EquipmentCategoryRequest;
import com.driveease.rentals.dto.equipment.EquipmentCategoryResponse;
import com.driveease.rentals.exception.BookingConflictException;
import com.driveease.rentals.exception.ResourceNotFoundException;
import com.driveease.rentals.repository.EquipmentCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipmentCategoryService {

    private final EquipmentCategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<EquipmentCategoryResponse> findAll() {
        return categoryRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EquipmentCategoryResponse findById(Long id) {
        return toResponse(getCategoryOrThrow(id));
    }

    @Transactional
    public EquipmentCategoryResponse create(EquipmentCategoryRequest request) {
        if (categoryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BookingConflictException(
                    "A category with name '" + request.getName() + "' already exists.");
        }
        EquipmentCategory category = EquipmentCategory.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public EquipmentCategoryResponse update(Long id, EquipmentCategoryRequest request) {
        EquipmentCategory category = getCategoryOrThrow(id);

        // Check uniqueness only if name is being changed
        if (!category.getName().equalsIgnoreCase(request.getName()) &&
                categoryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BookingConflictException(
                    "A category with name '" + request.getName() + "' already exists.");
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public void delete(Long id) {
        EquipmentCategory category = getCategoryOrThrow(id);
        categoryRepository.delete(category);
    }

    private EquipmentCategory getCategoryOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EquipmentCategory", "id", id));
    }

    private EquipmentCategoryResponse toResponse(EquipmentCategory c) {
        return EquipmentCategoryResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .description(c.getDescription())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}
