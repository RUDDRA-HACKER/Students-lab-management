package com.group_v.Student_labmangment_backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;

    private String type;
    // MAINTENANCE_DUE, CALIBRATION_DUE

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "equipment_id")
    private Equipment equipment;
}