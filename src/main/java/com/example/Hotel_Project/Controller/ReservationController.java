package com.example.Hotel_Project.Controller;

import com.example.Hotel_Project.Dto.ReservationDto;
import com.example.Hotel_Project.Service.ReservationService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class ReservationController {

    private final ReservationService reservationService;
    
    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping("/reservations")
    public ResponseEntity<ReservationDto> createReservation(@Valid @RequestBody ReservationDto reservationDto) {
        ReservationDto saved = reservationService.createReservation(reservationDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
