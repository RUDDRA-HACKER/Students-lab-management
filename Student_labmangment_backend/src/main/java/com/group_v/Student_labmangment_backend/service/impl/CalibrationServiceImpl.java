package com.group_v.Student_labmangment_backend.service.impl;

import com.group_v.Student_labmangment_backend.model.Calibration;
import com.group_v.Student_labmangment_backend.repository.CalibrationRepository;
import com.group_v.Student_labmangment_backend.service.CalibrationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CalibrationServiceImpl implements CalibrationService {

    private final CalibrationRepository repo;

    public CalibrationServiceImpl(CalibrationRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Calibration> getAll() {
        return repo.findAll();
    }

    @Override
    public Calibration getById(Long id) {
        return repo.findById(id).orElseThrow();
    }

    @Override
    public Calibration create(Calibration calibration) {
        return repo.save(calibration);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}