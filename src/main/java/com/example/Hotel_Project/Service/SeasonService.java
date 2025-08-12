package com.example.Hotel_Project.Service;

import com.example.Hotel_Project.Entity.Season;
import com.example.Hotel_Project.Repository.SeasonRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeasonService {
    private final SeasonRepository seasonRepository;
    public SeasonService(SeasonRepository seasonRepository) {
        this.seasonRepository = seasonRepository;
    }

    public List<Season> getAllSeasons() {
        return seasonRepository.findAll();
    }
}
