package com.group_v.Student_labmangment_backend.service.impl;

import com.group_v.Student_labmangment_backend.model.Equipment;
import com.group_v.Student_labmangment_backend.repository.EquipmentRepository;
import com.group_v.Student_labmangment_backend.service.SearchService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class SearchServiceImpl implements SearchService {

    private final EquipmentRepository equipmentRepository;

    public SearchServiceImpl(EquipmentRepository equipmentRepository) {
        this.equipmentRepository = equipmentRepository;
    }

    @Override
    public List<Equipment> searchEquipment(String q, String query, String search, String term) {
        String searchTerm = normalize(firstNonBlank(q, query, search, term));
        if (searchTerm == null) {
            return equipmentRepository.findAll();
        }

        List<Equipment> matches = new ArrayList<>(equipmentRepository.searchByTerm(searchTerm));

        // If the search term is a numeric ID, include exact ID lookup too.
        try {
            long id = Long.parseLong(searchTerm);
            equipmentRepository.findById(id).ifPresent(matches::add);
        } catch (NumberFormatException ignored) {
            // Ignore non-numeric terms.
        }

        return uniqueById(matches);
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.trim().isEmpty()) {
                return value;
            }
        }
        return null;
    }

    private String normalize(String input) {
        if (input == null) {
            return null;
        }

        String normalized = input.trim().replaceAll("\\s+", " ");
        return normalized.isEmpty() ? null : normalized;
    }

    private List<Equipment> uniqueById(List<Equipment> equipmentList) {
        Map<Long, Equipment> distinct = new LinkedHashMap<>();
        for (Equipment equipment : equipmentList) {
            distinct.put(equipment.getId(), equipment);
        }
        return new ArrayList<>(distinct.values());
    }
}

