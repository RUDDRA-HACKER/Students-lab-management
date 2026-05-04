package com.group_v.Student_labmangment_backend.controller;

import com.group_v.Student_labmangment_backend.model.Equipment;
import com.group_v.Student_labmangment_backend.exception.ResourceNotFoundException;
import com.group_v.Student_labmangment_backend.repository.AlertRepository;
import com.group_v.Student_labmangment_backend.repository.CalibrationRepository;
import com.group_v.Student_labmangment_backend.repository.EquipmentRepository;
import com.group_v.Student_labmangment_backend.repository.MaintenanceRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    private final EquipmentRepository repo;
    private final MaintenanceRepository maintenanceRepository;
    private final CalibrationRepository calibrationRepository;
    private final AlertRepository alertRepository;

    public EquipmentController(
            EquipmentRepository repo,
            MaintenanceRepository maintenanceRepository,
            CalibrationRepository calibrationRepository,
            AlertRepository alertRepository
    ) {
        this.repo = repo;
        this.maintenanceRepository = maintenanceRepository;
        this.calibrationRepository = calibrationRepository;
        this.alertRepository = alertRepository;
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

    @GetMapping("/reports/summary")
    public Map<String, Object> getReportsSummary() {
        LocalDate today = LocalDate.now();

        List<Equipment> equipment = repo.findAll();
        Map<String, Long> byStatus = new HashMap<>();
        for (Equipment item : equipment) {
            String status = item.getStatus() == null || item.getStatus().isBlank()
                    ? "UNKNOWN"
                    : item.getStatus().trim().toUpperCase();
            byStatus.put(status, byStatus.getOrDefault(status, 0L) + 1);
        }

        long dueMaintenance = maintenanceRepository.findAll().stream()
                .filter(record -> record.getMaintenanceDate() != null)
                .filter(record -> !record.getMaintenanceDate().isAfter(today))
                .filter(record -> {
                    String status = record.getStatus();
                    return status == null || !"COMPLETED".equalsIgnoreCase(status.trim());
                })
                .count();

        long dueCalibration = calibrationRepository.findAll().stream()
                .filter(record -> record.getNextDueDate() != null)
                .filter(record -> !record.getNextDueDate().isAfter(today))
                .count();

        long activeAlerts = alertRepository.count();

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalEquipment", equipment.size());
        summary.put("byStatus", byStatus);
        summary.put("dueMaintenance", dueMaintenance);
        summary.put("dueCalibration", dueCalibration);
        summary.put("activeAlerts", activeAlerts);
        summary.put("asOfDate", today.toString());
        return summary;
    }
}