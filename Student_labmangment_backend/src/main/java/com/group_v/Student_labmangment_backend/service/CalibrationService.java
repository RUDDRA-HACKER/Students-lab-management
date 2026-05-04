package com.group_v.Student_labmangment_backend.service;

import com.group_v.Student_labmangment_backend.model.Calibration;
import java.util.List;

public interface CalibrationService {

    List<Calibration> getAll();

    Calibration getById(Long id);

    Calibration create(Calibration calibration);

    void delete(Long id);
}