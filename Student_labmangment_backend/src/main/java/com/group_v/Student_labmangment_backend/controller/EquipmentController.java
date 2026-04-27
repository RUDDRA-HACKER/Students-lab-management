package com.group_v.Student_labmangment_backend.controller;

import com.group_v.Student_labmangment_backend.model.Equipment;
import com.group_v.Student_labmangment_backend.exception.ResourceNotFoundException;
import com.group_v.Student_labmangment_backend.repository.EquipmentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    private final EquipmentRepository repo;

    public EquipmentController(EquipmentRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Equipment> getAll(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "search", required = false) String search
    ) {
        String term = firstNonBlank(q, search);
        if (term == null) {
            return repo.findAll();
        }

        List<Equipment> matches = new ArrayList<>(
                repo.findByNameContainingIgnoreCaseOrTypeContainingIgnoreCaseOrSerialNumberContainingIgnoreCaseOrStatusContainingIgnoreCase(
                        term, term, term, term
                )
        );

        // Support direct ID search as well (for terms like "1" or "42").
        try {
            long id = Long.parseLong(term);
            repo.findById(id).ifPresent(matches::add);
        } catch (NumberFormatException ignored) {
            // Non-numeric search terms are handled by text filters above.
        }

        return uniqueById(matches);
    }

    private String firstNonBlank(String first, String second) {
        if (first != null && !first.trim().isEmpty()) {
            return first.trim();
        }
        if (second != null && !second.trim().isEmpty()) {
            return second.trim();
        }
        return null;
    }

    private List<Equipment> uniqueById(List<Equipment> data) {
        Map<Long, Equipment> byId = new LinkedHashMap<>();
        for (Equipment item : data) {
            byId.put(item.getId(), item);
        }
        return new ArrayList<>(byId.values());
    }

    @PostMapping
    public Equipment create(@RequestBody Equipment equipment) {
        return repo.save(equipment);
    }

    @GetMapping("/{id}")
    public Equipment getById(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with id: " + id));
    }

    @PutMapping("/{id}")
    public Equipment update(@PathVariable Long id, @RequestBody Equipment newData) {
        Equipment eq = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with id: " + id));

        eq.setName(newData.getName());
        eq.setType(newData.getType());
        eq.setSerialNumber(newData.getSerialNumber());
        eq.setStatus(newData.getStatus());

        return repo.save(eq);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}