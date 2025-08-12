package com.example.Hotel_Project.Repository;

import com.example.Hotel_Project.Entity.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HolidayRepository extends JpaRepository<Holiday, Integer> {

}
