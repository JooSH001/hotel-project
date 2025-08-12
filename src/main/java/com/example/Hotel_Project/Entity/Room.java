package com.example.Hotel_Project.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "room")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id
    private Integer id;

    private String name;

    private String name_eng;

    private Integer area;

    private Integer capacity;

    @Column(name = "min_guest")
    private Integer minGuest;

    private String description;

    @Column(name = "description_eng")
    private String descriptionEng;

}
