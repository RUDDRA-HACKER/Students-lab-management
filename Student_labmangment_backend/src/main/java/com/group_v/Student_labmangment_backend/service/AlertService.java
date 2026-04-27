package com.group_v.Student_labmangment_backend.service;

import com.group_v.Student_labmangment_backend.model.Alert;
import java.util.List;

public interface AlertService {

    List<Alert> getAll();

    Alert create(Alert alert);

    void delete(Long id);
}