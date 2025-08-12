package com.example.Hotel_Project.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "holiday")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Holiday {

    @Id
    private Integer id;

    @Column(name = "holiday_name")
    private String holidayName;

    @Column(name = "holiday_date")
    private java.sql.Date holidayDate;

}
