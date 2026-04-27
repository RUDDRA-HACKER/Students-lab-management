package com.group_v.Student_labmangment_backend;

import com.group_v.Student_labmangment_backend.model.Equipment;
import com.group_v.Student_labmangment_backend.repository.AlertRepository;
import com.group_v.Student_labmangment_backend.repository.CalibrationRepository;
import com.group_v.Student_labmangment_backend.repository.EquipmentRepository;
import com.group_v.Student_labmangment_backend.repository.MaintenanceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SearchControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private CalibrationRepository calibrationRepository;

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    @BeforeEach
    void setupData() {
        alertRepository.deleteAll();
        calibrationRepository.deleteAll();
        maintenanceRepository.deleteAll();
        equipmentRepository.deleteAll();

        equipmentRepository.save(new Equipment(null, "Microscope", "Optical", "MS-001", "Operational"));
        equipmentRepository.save(new Equipment(null, "Centrifuge", "Mechanical", "CF-101", "Maintenance"));
        equipmentRepository.save(new Equipment(null, "Spectrometer", "Analytical", "SP-700", "Retired"));
    }

    @Test
    void searchEquipmentByQParamWorks() throws Exception {
        mockMvc.perform(get("/api/search/equipment").param("q", "micro"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Microscope"));
    }

    @Test
    void searchEquipmentByQueryAliasWorks() throws Exception {
        mockMvc.perform(get("/api/search/equipment").param("query", "retired"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("Retired"));
    }

    @Test
    void searchEquipmentBySearchAliasWorks() throws Exception {
        mockMvc.perform(get("/api/search/equipment").param("search", "centri"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Centrifuge"));
    }

    @Test
    void searchEquipmentByTermAliasWorks() throws Exception {
        mockMvc.perform(get("/api/search/equipment").param("term", "analytical"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].type").value("Analytical"));
    }

    @Test
    void searchRouteAliasWorks() throws Exception {
        mockMvc.perform(get("/api/search").param("q", "spec"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Spectrometer"));
    }
}

