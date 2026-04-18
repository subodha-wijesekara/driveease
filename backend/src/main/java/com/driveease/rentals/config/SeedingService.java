package com.driveease.rentals.config;

import com.driveease.rentals.domain.User;
import com.driveease.rentals.domain.EquipmentCategory;
import com.driveease.rentals.domain.EquipmentItem;
import com.driveease.rentals.domain.enums.Role;
import com.driveease.rentals.domain.enums.ItemCondition;
import com.driveease.rentals.repository.UserRepository;
import com.driveease.rentals.repository.EquipmentCategoryRepository;
import com.driveease.rentals.repository.EquipmentItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class SeedingService {

    private final UserRepository userRepository;
    private final EquipmentCategoryRepository categoryRepository;
    private final EquipmentItemRepository itemRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void performSeeding() {
        // 1. Seed admin user
        if (!userRepository.existsByEmail("admin@driveease.com")) {
            User admin = User.builder()
                    .fullName("DriveEase Admin")
                    .email("admin@driveease.com")
                    .passwordHash(passwordEncoder.encode("Admin@1234"))
                    .role(Role.ADMIN)
                    .active(true)
                    .build();
            userRepository.save(admin);
            log.info("✅ Default admin seeded → admin@driveease.com");
        }

        // 2. Seed Categories and 50+ Vehicles
        if (itemRepository.count() < 50) {
            log.info("🚀 Initiating Fleet Seeding (Applying reliable CDN Images)...");

            EquipmentCategory sedans = createCategory("Sedans", "Premium executive and family sedans for comfort and efficiency.");
            EquipmentCategory suvs = createCategory("SUVs & 4x4s", "Rugged and spacious vehicles for any terrain and family adventure.");
            EquipmentCategory performance = createCategory("Performance", "High-performance sports cars for the ultimate driving experience.");
            EquipmentCategory motorcycles = createCategory("Motorcycles", "Premium cruisers and sport bikes for two-wheel enthusiasts.");
            EquipmentCategory vans = createCategory("Vans & Transport", "Practical vans and people movers for larger groups and cargo.");

            seedVehicles(sedans, SEDAN_DATA, SedanNames, SedanImages, 15, 5, "Hybrid");
            seedVehicles(suvs, SUV_DATA, SuvNames, SuvImages, 15, 7, "Diesel");
            seedVehicles(performance, PERFORMANCE_DATA, PerformanceNames, PerformanceImages, 8, 2, "Petrol");
            seedVehicles(motorcycles, BIKE_DATA, BikeNames, BikeImages, 10, 2, "Petrol");
            seedVehicles(vans, VAN_DATA, VanNames, VanImages, 6, 12, "Diesel");

            log.info("✅ Successfully re-seeded 50+ Vehicles with high-quality CDN images.");
        } else {
            // Update existing items if specs are missing
            long missingSpecsCount = itemRepository.findAll().stream()
                    .filter(i -> i.getSeats() == null)
                    .count();
            if (missingSpecsCount > 0) {
                log.info("🛠️ Updating specifications for {} existing vehicles...", missingSpecsCount);
                itemRepository.findAll().forEach(item -> {
                    String catName = item.getCategory().getName();
                    if ("Sedans".equals(catName)) { item.setSeats(5); item.setFuelType("Hybrid"); }
                    else if ("SUVs & 4x4s".equals(catName)) { item.setSeats(7); item.setFuelType("Diesel"); }
                    else if ("Performance".equals(catName)) { item.setSeats(2); item.setFuelType("Petrol"); }
                    else if ("Motorcycles".equals(catName)) { item.setSeats(2); item.setFuelType("Petrol"); }
                    else if ("Vans & Transport".equals(catName)) { item.setSeats(12); item.setFuelType("Diesel"); }
                    itemRepository.save(item);
                });
                log.info("✅ Specifications updated.");
            }
        }
    }

    private EquipmentCategory createCategory(String name, String desc) {
        EquipmentCategory cat = EquipmentCategory.builder().name(name).description(desc).build();
        return categoryRepository.save(cat);
    }

    private void seedVehicles(EquipmentCategory category, String baseDesc, String[] names, String[] images, int count, int seats, String fuelType) {
        for (int i = 0; i < count; i++) {
            String name = names[i % names.length] + " " + (2022 + (i % 3));
            EquipmentItem item = EquipmentItem.builder()
                    .name(name)
                    .category(category)
                    .description(baseDesc + " This vehicle offers exceptional safety, fuel economy, and a premium " + category.getName().toLowerCase() + " experience.")
                    .dailyRate(new BigDecimal(45 + (Math.random() * 250)))
                    .totalStock(1 + (int)(Math.random() * 5))
                    .itemCondition(ItemCondition.NEW)
                    .imageUrl(images[i % images.length])
                    .seats(seats)
                    .fuelType(fuelType)
                    .active(true)
                    .build();
            itemRepository.save(item);
        }
    }

    // --- DATA POOLS ---
    private static final String SUV_DATA = "Reliable all-terrain capability with Toyota's legendary durability.";
    private static final String[] SuvNames = {"Land Cruiser Prado", "RAV4 Adventure", "Highlander Hybrid", "Sequoia Platinum", "4Runner TRD Pro", "Corolla Cross", "Fortuner Legender"};
    private static final String[] SuvImages = {"/images/fleet_suv.png"};

    private static final String SEDAN_DATA = "Seamless comfort and advanced technology for executive city travel.";
    private static final String[] SedanNames = {"Camry XSE", "Corolla Apex", "Avalon Touring", "Mirai Fuel Cell", "Crown Platinum", "Century", "Yaris Ativ"};
    private static final String[] SedanImages = {"/images/fleet_sedan.png"};

    private static final String PERFORMANCE_DATA = "Uncompromising performance and sharp handling for driving enthusiasts.";
    private static final String[] PerformanceNames = {"GR Supra", "GR86 Premium", "GR Corolla", "86 TRD", "Supra RZ"};
    private static final String[] PerformanceImages = {"/images/fleet_sports.png"};

    private static final String BIKE_DATA = "Precision engineering on two wheels. Experience the freedom of the road.";
    private static final String[] BikeNames = {"Honda CB1000R", "Yamaha MT-09", "BMW S1000RR", "Kawasaki Ninja Z", "Triumph Speed Triple", "Ducati Monster", "KTM Super Duke"};
    private static final String[] BikeImages = {"/images/fleet_motorcycle.png"};

    private static final String VAN_DATA = "Versatile transport solutions for cargo, groups, and family trips.";
    private static final String[] VanNames = {"Hiace Commuter", "Sienna Limited", "Proace Verso", "Alphard Executive", "Vellfire"};
    private static final String[] VanImages = {"/images/fleet_van.png"};
}
