package com.group_v.Student_labmangment_backend.service.impl;

import com.group_v.Student_labmangment_backend.model.Maintenance;
import com.group_v.Student_labmangment_backend.repository.MaintenanceRepository;
import com.group_v.Student_labmangment_backend.service.MaintenanceService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaintenanceServiceImpl implements MaintenanceService {

    private final MaintenanceRepository repo;

    public MaintenanceServiceImpl(MaintenanceRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Maintenance> getAll() {
        return repo.findAll();
    }

    @Override
    public Maintenance getById(Long id) {
        return repo.findById(id).orElseThrow();
    }

    @Override
    public Maintenance create(Maintenance maintenance) {
        return repo.save(maintenance);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}