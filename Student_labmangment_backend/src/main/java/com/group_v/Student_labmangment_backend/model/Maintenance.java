package com.group_v.Student_labmangment_backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Maintenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    private LocalDate maintenanceDate;

    private String performedBy;

    private String status;
    // PENDING, COMPLETED

    @ManyToOne
    @JoinColumn(name = "equipment_id")
    private Equipment equipment;
}