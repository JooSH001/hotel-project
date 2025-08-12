package com.example.Hotel_Project.Repository;

import com.example.Hotel_Project.Entity.Season;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeasonRepository extends JpaRepository<Season, Integer> {

}
