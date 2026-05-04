package com.group_v.Student_labmangment_backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Calibration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate calibrationDate;

    private LocalDate nextDueDate;

    private String calibratedBy;

    private String result;
    // PASSED, FAILED

    @ManyToOne
    @JoinColumn(name = "equipment_id")
    private Equipment equipment;
}