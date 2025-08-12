package com.example.Hotel_Project.Repository;

import com.example.Hotel_Project.Entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    List<Reservation> findByRoom_Id(Integer roomId);

}
