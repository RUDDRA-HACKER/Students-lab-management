package com.group_v.Student_labmangment_backend.repository;

import com.group_v.Student_labmangment_backend.model.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

	@Query("""
			SELECT e FROM Equipment e
			WHERE LOWER(e.name) LIKE LOWER(CONCAT('%', :term, '%'))
			   OR LOWER(e.type) LIKE LOWER(CONCAT('%', :term, '%'))
			   OR LOWER(e.serialNumber) LIKE LOWER(CONCAT('%', :term, '%'))
			   OR LOWER(e.status) LIKE LOWER(CONCAT('%', :term, '%'))
			""")
	List<Equipment> searchByTerm(@Param("term") String term);

	List<Equipment> findByNameContainingIgnoreCaseOrTypeContainingIgnoreCaseOrSerialNumberContainingIgnoreCaseOrStatusContainingIgnoreCase(
			String name,
			String type,
			String serialNumber,
			String status
	);
}