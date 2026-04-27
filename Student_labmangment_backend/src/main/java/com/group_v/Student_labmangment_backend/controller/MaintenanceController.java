package com.group_v.Student_labmangment_backend.controller;

import com.group_v.Student_labmangment_backend.exception.ResourceNotFoundException;
import com.group_v.Student_labmangment_backend.model.Maintenance;
import com.group_v.Student_labmangment_backend.repository.MaintenanceRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    private final MaintenanceRepository repo;

    public MaintenanceController(MaintenanceRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Maintenance> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Maintenance create(@RequestBody Maintenance data) {
        return repo.save(data);
    }

    @GetMapping("/{id}")
    public Maintenance getById(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance record not found with id: " + id));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}