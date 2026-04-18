package com.driveease.rentals.service;

import com.driveease.rentals.domain.EquipmentCategory;
import com.driveease.rentals.domain.EquipmentItem;
import com.driveease.rentals.domain.enums.ItemCondition;
import com.driveease.rentals.dto.equipment.EquipmentItemRequest;
import com.driveease.rentals.dto.equipment.EquipmentItemResponse;
import com.driveease.rentals.exception.ResourceNotFoundException;
import com.driveease.rentals.repository.EquipmentCategoryRepository;
import com.driveease.rentals.repository.EquipmentItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipmentItemService {

    private final EquipmentItemRepository itemRepository;
    private final EquipmentCategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public Page<EquipmentItemResponse> findAllActive(Pageable pageable) {
        return itemRepository.findByActiveTrueOrderByNameAsc(pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public List<EquipmentItemResponse> findByCategory(Long categoryId) {
        return itemRepository.findByCategoryIdAndActiveTrue(categoryId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EquipmentItemResponse findById(Long id) {
        return toResponse(getItemOrThrow(id));
    }

    @Transactional
    public EquipmentItemResponse create(EquipmentItemRequest request) {
        EquipmentCategory category = getCategoryOrThrow(request.getCategoryId());

        EquipmentItem item = EquipmentItem.builder()
                .category(category)
                .name(request.getName())
                .description(request.getDescription())
                .dailyRate(request.getDailyRate())
                .totalStock(request.getTotalStock())
                .itemCondition(request.getItemCondition() != null
                        ? request.getItemCondition()
                        : ItemCondition.GOOD)
                .imageUrl(request.getImageUrl())
                .seats(request.getSeats())
                .fuelType(request.getFuelType())
                .active(true)
                .build();

        return toResponse(itemRepository.save(item));
    }

    @Transactional
    public EquipmentItemResponse update(Long id, EquipmentItemRequest request) {
        EquipmentItem item = getItemOrThrow(id);
        EquipmentCategory category = getCategoryOrThrow(request.getCategoryId());

        item.setCategory(category);
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setDailyRate(request.getDailyRate());
        item.setTotalStock(request.getTotalStock());
        if (request.getItemCondition() != null) {
            item.setItemCondition(request.getItemCondition());
        }
        item.setImageUrl(request.getImageUrl());
        item.setSeats(request.getSeats());
        item.setFuelType(request.getFuelType());

        return toResponse(itemRepository.save(item));
    }

    /**
     * Soft delete — sets active = false so booking history remains intact.
     */
    @Transactional
    public void softDelete(Long id) {
        EquipmentItem item = getItemOrThrow(id);
        item.setActive(false);
        itemRepository.save(item);
    }

    public EquipmentItem getItemOrThrow(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EquipmentItem", "id", id));
    }

    private EquipmentCategory getCategoryOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EquipmentCategory", "id", id));
    }

    public EquipmentItemResponse toResponse(EquipmentItem item) {
        return EquipmentItemResponse.builder()
                .id(item.getId())
                .categoryId(item.getCategory().getId())
                .categoryName(item.getCategory().getName())
                .name(item.getName())
                .description(item.getDescription())
                .dailyRate(item.getDailyRate())
                .totalStock(item.getTotalStock())
                .itemCondition(item.getItemCondition())
                .imageUrl(item.getImageUrl())
                .active(item.isActive())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .seats(item.getSeats())
                .fuelType(item.getFuelType())
                .build();
    }
}
