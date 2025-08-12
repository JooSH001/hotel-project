package com.example.Hotel_Project.Service;

import com.example.Hotel_Project.Dto.ReservationDto;
import com.example.Hotel_Project.Entity.Reservation;
import com.example.Hotel_Project.Entity.Room;
import com.example.Hotel_Project.Repository.ReservationRepository;
import com.example.Hotel_Project.Repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private RoomRepository roomRepository;

    public ReservationService(ReservationRepository reservationRepository, RoomRepository roomRepository) {
        this.reservationRepository = reservationRepository;
        this.roomRepository = roomRepository;
    }

    public List<Reservation> getReservationsByRoomId(Integer roomId) {
        return reservationRepository.findByRoom_Id(roomId);
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public ReservationDto createReservation(ReservationDto dto) {
        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        Reservation reservation = dto.toEntity(room);

        reservationRepository.save(reservation);
        return ReservationDto.fromEntity(reservation);
    }

}
