package com.group_v.Student_labmangment_backend.service.impl;

import com.group_v.Student_labmangment_backend.model.Alert;
import com.group_v.Student_labmangment_backend.repository.AlertRepository;
import com.group_v.Student_labmangment_backend.service.AlertService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlertServiceImpl implements AlertService {

    private final AlertRepository repo;

    public AlertServiceImpl(AlertRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Alert> getAll() {
        return repo.findAll();
    }

    @Override
    public Alert create(Alert alert) {
        return repo.save(alert);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}