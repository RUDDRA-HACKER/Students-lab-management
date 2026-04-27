package com.group_v.Student_labmangment_backend.controller;

import com.group_v.Student_labmangment_backend.model.Alert;
import com.group_v.Student_labmangment_backend.repository.AlertRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertRepository repo;

    public AlertController(AlertRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Alert> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Alert create(@RequestBody Alert data) {
        return repo.save(data);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}