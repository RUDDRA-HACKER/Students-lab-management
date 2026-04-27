package com.group_v.Student_labmangment_backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String type;

    private String serialNumber;

    private String status;
    // AVAILABLE, IN_USE, UNDER_MAINTENANCE
}