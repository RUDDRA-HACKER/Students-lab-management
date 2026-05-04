package com.group_v.Student_labmangment_backend.service.impl;

import com.group_v.Student_labmangment_backend.model.Equipment;
import com.group_v.Student_labmangment_backend.repository.EquipmentRepository;
import com.group_v.Student_labmangment_backend.service.EquipmentService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipmentServiceImpl implements EquipmentService {

    private final EquipmentRepository repo;

    public EquipmentServiceImpl(EquipmentRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Equipment> getAll() {
        return repo.findAll();
    }

    @Override
    public Equipment getById(Long id) {
        return repo.findById(id).orElseThrow();
    }

    @Override
    public Equipment create(Equipment equipment) {
        return repo.save(equipment);
    }

    @Override
    public Equipment update(Long id, Equipment newData) {
        Equipment eq = repo.findById(id).orElseThrow();

        eq.setName(newData.getName());
        eq.setType(newData.getType());
        eq.setSerialNumber(newData.getSerialNumber());
        eq.setStatus(newData.getStatus());

        return repo.save(eq);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}