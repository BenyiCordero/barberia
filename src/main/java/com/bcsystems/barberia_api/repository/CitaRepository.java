package com.bcsystems.barberia_api.repository;

import com.bcsystems.barberia_api.domain.Cita;
import com.bcsystems.barberia_api.domain.en.EstadoCita;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Integer> {
    Page<Cita> findByEmpleadoIdEmpleado(Integer idEmpleado, Pageable pageable);
    Page<Cita> findByClienteIdCliente(Integer idCliente, Pageable pageable);
    Page<Cita> findByEstado(EstadoCita estado, Pageable pageable);
    Page<Cita> findByFechaInicioBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);
    List<Cita> findByEmpleadoIdEmpleadoAndFechaInicioBetweenAndEstadoNot(
            Integer idEmpleado, LocalDateTime start, LocalDateTime end, EstadoCita estado);
}