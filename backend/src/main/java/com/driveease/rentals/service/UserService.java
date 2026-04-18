package com.driveease.rentals.service;

import com.driveease.rentals.domain.User;
import com.driveease.rentals.dto.user.ChangePasswordRequest;
import com.driveease.rentals.dto.user.UpdateProfileRequest;
import com.driveease.rentals.dto.user.UserDTO;
import com.driveease.rentals.exception.BookingConflictException;
import com.driveease.rentals.exception.ResourceNotFoundException;
import com.driveease.rentals.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDTO getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return mapToDTO(user);
    }

    @Transactional
    public UserDTO updateProfile(String currentEmail, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentEmail));

        // Check email uniqueness if it's being changed
        if (!user.getEmail().equalsIgnoreCase(request.getEmail()) && 
            userRepository.existsByEmail(request.getEmail())) {
            throw new BookingConflictException("Email '" + request.getEmail() + "' is already in use.");
        }

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        
        User savedUser = userRepository.save(user);
        return mapToDTO(savedUser);
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BookingConflictException("Invalid current password.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private UserDTO mapToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
