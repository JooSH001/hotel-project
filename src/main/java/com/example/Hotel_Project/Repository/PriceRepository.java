package com.example.Hotel_Project.Repository;

import com.example.Hotel_Project.Entity.Price;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PriceRepository extends JpaRepository<Price, Integer> {
    List<Price> findByRoom_Id(Integer roomId);

}
