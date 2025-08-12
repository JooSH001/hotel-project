package com.example.Hotel_Project.Service;

import com.example.Hotel_Project.Entity.Price;
import com.example.Hotel_Project.Repository.PriceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PriceService {
    private final PriceRepository priceRepository;
    public PriceService(PriceRepository priceRepository) {
        this.priceRepository = priceRepository;
    }

    public List<Price> getAllPrices() {
        return priceRepository.findAll();
    }

    public List<Price> getPricesByRoomId(Integer roomId) {
        return priceRepository.findByRoom_Id(roomId);
    }
}
