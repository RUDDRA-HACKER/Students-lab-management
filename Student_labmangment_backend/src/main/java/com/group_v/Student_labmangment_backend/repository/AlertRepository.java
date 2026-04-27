package com.group_v.Student_labmangment_backend.repository;

import com.group_v.Student_labmangment_backend.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertRepository extends JpaRepository<Alert, Long> {
}