package com.bcsystems.barberia_api.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "cita_details")
public class CitaDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCitaDetails;
    @ManyToOne
    @JoinColumn(name = "id_cita")
    private Cita cita;
    @ManyToOne
    @JoinColumn(name = "id_servicio")
    private Servicio servicio;
    private Double precio;

}
