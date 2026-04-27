package com.group_v.Student_labmangment_backend.service;

import com.group_v.Student_labmangment_backend.model.Equipment;
import java.util.List;

public interface EquipmentService {

    List<Equipment> getAll();

    Equipment getById(Long id);

    Equipment create(Equipment equipment);

    Equipment update(Long id, Equipment equipment);

    void delete(Long id);
}