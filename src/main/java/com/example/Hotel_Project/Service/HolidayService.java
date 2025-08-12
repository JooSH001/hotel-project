package com.example.Hotel_Project.Service;

import com.example.Hotel_Project.Entity.Holiday;
import com.example.Hotel_Project.Repository.HolidayRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HolidayService {
    private final HolidayRepository holidayRepository;
    public HolidayService(HolidayRepository holidayRepository) {
        this.holidayRepository = holidayRepository;
    }

    public List<Holiday> getAllHolidays() {
        return holidayRepository.findAll();
    }
}
