package com.example.Hotel_Project.Controller;

import com.example.Hotel_Project.Entity.*;
import com.example.Hotel_Project.Service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private PriceService priceService;

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private HolidayService holidayService;

    @Autowired
    private SeasonService seasonService;

    public ApiController(RoomService roomService, PriceService priceService, ReservationService reservationService,
                         HolidayService holidayService, SeasonService seasonService) {
        this.roomService = roomService;
        this.priceService = priceService;
        this.reservationService = reservationService;
        this.holidayService = holidayService;
        this.seasonService = seasonService;
    }

    @GetMapping("/rooms")
    public List<Room> getRooms() {
        return roomService.getAllRooms();
    }

    @GetMapping("/rooms/{id}")
    public Room getRoom(@PathVariable Integer id) {
        return roomService.getRoomById(id);
    }

    @GetMapping("/prices")
    public List<Price> getPrices(@RequestParam(required = false) Integer roomId) {
        if (roomId != null) {
            return priceService.getPricesByRoomId(roomId);
        }
        return priceService.getAllPrices();
    }

    @GetMapping("/reservations")
    public List<Reservation> getReservations(@RequestParam(required = false) Integer roomId) {
        if (roomId != null) {
            return reservationService.getReservationsByRoomId(roomId);
        }
        return reservationService.getAllReservations();
    }

    @GetMapping("/holidays")
    public List<Holiday> getHolidays() {
        return holidayService.getAllHolidays();
    }

    @GetMapping("/seasons")
    public List<Season> getSeasons() {
        return seasonService.getAllSeasons();
    }

}
