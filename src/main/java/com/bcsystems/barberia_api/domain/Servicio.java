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
@Table(name = "servicio")
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idServicio;
    @Column(unique = true)
    private String nombre;
    private String descripcion;
    private Integer duracionMinutos;
    private Double precio;
    private Integer status = 1;

}
