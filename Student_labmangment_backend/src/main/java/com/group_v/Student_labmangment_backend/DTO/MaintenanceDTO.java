package com.group_v.Student_labmangment_backend.DTO;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceDTO {

    private Long id;

    private String description;

    private LocalDate maintenanceDate;

    private String performedBy;

    private String status;

    private Long equipmentId; // instead of full Equipment object
}