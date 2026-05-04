package com.group_v.Student_labmangment_backend.controller;

import com.group_v.Student_labmangment_backend.exception.ResourceNotFoundException;
import com.group_v.Student_labmangment_backend.model.Maintenance;
import com.group_v.Student_labmangment_backend.repository.MaintenanceRepository;
import org.springframework.web.bind.annotation.*;

<<<<<<< HEAD
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
=======
import java.util.List;
>>>>>>> 492aea2b269ece742014be469c283df7dc39372c

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
<<<<<<< HEAD

    @GetMapping("/frequency/monthly")
    public Map<String, Object> getMonthlyFrequency(
            @RequestParam(value = "months", defaultValue = "6") int months
    ) {
        int normalizedMonths = Math.max(1, Math.min(months, 36));
        YearMonth current = YearMonth.now();
        YearMonth start = current.minusMonths(normalizedMonths - 1L);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        Map<YearMonth, Long> counts = new TreeMap<>();
        for (int i = 0; i < normalizedMonths; i++) {
            YearMonth month = start.plusMonths(i);
            counts.put(month, 0L);
        }

        for (Maintenance record : repo.findAll()) {
            LocalDate date = record.getMaintenanceDate();
            if (date == null) {
                continue;
            }

            YearMonth month = YearMonth.from(date);
            if (!month.isBefore(start) && !month.isAfter(current)) {
                counts.put(month, counts.getOrDefault(month, 0L) + 1L);
            }
        }

        Map<String, Long> monthlyCounts = new LinkedHashMap<>();
        counts.forEach((month, count) -> monthlyCounts.put(month.format(formatter), count));

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("months", normalizedMonths);
        response.put("startMonth", start.format(formatter));
        response.put("endMonth", current.format(formatter));
        response.put("counts", monthlyCounts);
        return response;
    }
=======
>>>>>>> 492aea2b269ece742014be469c283df7dc39372c
}