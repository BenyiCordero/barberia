package com.bcsystems.barberia_api.repository;

import com.bcsystems.barberia_api.domain.Cliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    Page<Cliente> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);
    Page<Cliente> findByTelefonoContaining(String telefono, Pageable pageable);
    boolean existsByTelefono(String telefono);
    boolean existsByNombre(String nombre);
}