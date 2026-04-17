package com.bcsystems.barberia_api.repository;

import com.bcsystems.barberia_api.domain.Empleado;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado, Integer> {
    Page<Empleado> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);
    boolean existsByTelefono(String telefono);
    boolean existsByNombre(String nombre);
}