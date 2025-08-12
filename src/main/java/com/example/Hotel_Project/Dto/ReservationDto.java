package com.example.Hotel_Project.Dto;

import com.example.Hotel_Project.Entity.Reservation;
import com.example.Hotel_Project.Entity.Room;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
public class ReservationDto {
    private Integer id;
    private Integer roomId;
    private String customerName;
    private String phoneNumber;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int numberOfGuests;
    private int totalPrice;

    // Entity → DTO
    public static ReservationDto fromEntity(Reservation reservation) {
        ReservationDto dto = new ReservationDto();
        dto.setId(reservation.getId());
        dto.setRoomId(reservation.getRoom().getId());
        dto.setCustomerName(reservation.getCustomerName());
        dto.setPhoneNumber(reservation.getPhoneNumber());
        dto.setCheckInDate(reservation.getCheckInDate());
        dto.setCheckOutDate(reservation.getCheckOutDate());
        dto.setNumberOfGuests(reservation.getNumberOfGuests());
        dto.setTotalPrice(reservation.getTotalPrice());
        return dto;
    }

    // DTO → Entity
    public Reservation toEntity(Room room) {
        return Reservation.builder()
                .customerName(this.customerName)
                .phoneNumber(this.phoneNumber)
                .checkInDate(this.checkInDate)
                .checkOutDate(this.checkOutDate)
                .numberOfGuests(this.numberOfGuests)
                .totalPrice(this.totalPrice)
                .room(room)
                .build();
    }

}
