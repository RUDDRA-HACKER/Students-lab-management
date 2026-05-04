package com.group_v.Student_labmangment_backend.service;

import com.group_v.Student_labmangment_backend.model.Equipment;

import java.util.List;

public interface SearchService {

    List<Equipment> searchEquipment(String q, String query, String search, String term);
}

