package com.bcsystems.barberia_api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CitaDetailsDTO {
    private Integer idCitaDetails;
    private Integer idCita;
    private Integer idServicio;
    private String nombreServicio;
    private Double precio;
}