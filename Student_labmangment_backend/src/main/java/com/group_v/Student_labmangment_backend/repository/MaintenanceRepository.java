package com.group_v.Student_labmangment_backend.repository;

import com.group_v.Student_labmangment_backend.model.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
}