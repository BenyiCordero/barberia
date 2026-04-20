package com.bcsystems.barberia_api.dto;

import com.bcsystems.barberia_api.domain.en.EstadoCita;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CitaDTO {
    private Integer idCita;
    private Integer idCliente;
    private String nombreCliente;
    private Integer idEmpleado;
    private String nombreEmpleado;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private EstadoCita estado;
    private List<CitaDetailsDTO> detalles;

    @JsonIgnore
    public Integer getId() {
        return idCita;
    }
}