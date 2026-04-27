package com.group_v.Student_labmangment_backend.repository;

import com.group_v.Student_labmangment_backend.model.Calibration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CalibrationRepository extends JpaRepository<Calibration, Long> {
}