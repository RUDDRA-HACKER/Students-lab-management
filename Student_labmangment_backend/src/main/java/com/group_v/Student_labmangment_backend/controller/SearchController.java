package com.group_v.Student_labmangment_backend.controller;

import com.group_v.Student_labmangment_backend.model.Equipment;
import com.group_v.Student_labmangment_backend.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/search")
public class SearchController {
    @Autowired
    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping("/equipment")
    public List<Equipment> searchEquipment(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "term", required = false) String term
    ) {
        return searchService.searchEquipment(q, query, search, term);
    }

    @GetMapping
    public List<Equipment> searchEquipmentAlias(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "term", required = false) String term
    ) {
        return searchService.searchEquipment(q, query, search, term);
    }
}

