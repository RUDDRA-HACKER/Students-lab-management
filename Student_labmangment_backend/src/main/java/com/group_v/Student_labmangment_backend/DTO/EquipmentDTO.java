package com.group_v.Student_labmangment_backend.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentDTO {

    private Long id;

    private String name;

    private String type;

    private String serialNumber;

    private String status;
}