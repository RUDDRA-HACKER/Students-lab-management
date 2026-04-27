package com.group_v.Student_labmangment_backend.controller;

import com.group_v.Student_labmangment_backend.exception.ResourceNotFoundException;
import com.group_v.Student_labmangment_backend.model.Calibration;
import com.group_v.Student_labmangment_backend.repository.CalibrationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calibration")
public class CalibrationController {

    private final CalibrationRepository repo;

    public CalibrationController(CalibrationRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Calibration> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Calibration create(@RequestBody Calibration data) {
        return repo.save(data);
    }

    @GetMapping("/{id}")
    public Calibration getById(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Calibration record not found with id: " + id));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}