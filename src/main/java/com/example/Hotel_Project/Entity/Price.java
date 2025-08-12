package com.example.Hotel_Project.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "price")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Price {

    @Id
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    @ManyToOne
    @JoinColumn(name = "season_id")
    private Season season;

    @Column(name = "weekday_price")
    private Integer weekdayPrice;

    @Column(name = "weekend_price")
    private Integer weekendPrice;

    @Column(name = "holiday_price")
    private Integer holidayPrice;

}
