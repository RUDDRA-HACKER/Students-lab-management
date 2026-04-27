package com.group_v.Student_labmangment_backend.service;

import com.group_v.Student_labmangment_backend.model.Maintenance;
import java.util.List;

public interface MaintenanceService {

    List<Maintenance> getAll();

    Maintenance getById(Long id);

    Maintenance create(Maintenance maintenance);

    void delete(Long id);
}