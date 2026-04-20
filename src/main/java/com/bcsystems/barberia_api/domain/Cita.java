package com.bcsystems.barberia_api.domain;

import com.bcsystems.barberia_api.domain.en.EstadoCita;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "cita")
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCita;
    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;
    @ManyToOne
    @JoinColumn(name = "id_empleado")
    private Empleado empleado;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    @Enumerated(EnumType.STRING)
    private EstadoCita estado;
    @OneToMany(mappedBy = "cita", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CitaDetails> detalles = new ArrayList<>();

}
