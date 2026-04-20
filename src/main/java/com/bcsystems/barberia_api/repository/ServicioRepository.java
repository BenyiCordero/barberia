package com.bcsystems.barberia_api.repository;

import com.bcsystems.barberia_api.domain.Servicio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio, Integer> {
    Page<Servicio> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);
    Page<Servicio> findByStatus(Integer status, Pageable pageable);
    boolean existsByNombre(String nombre);
}