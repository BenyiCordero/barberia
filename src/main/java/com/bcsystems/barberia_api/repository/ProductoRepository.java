package com.bcsystems.barberia_api.repository;

import com.bcsystems.barberia_api.domain.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    Page<Producto> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);
    Page<Producto> findByStatus(Integer status, Pageable pageable);
    boolean existsByNombre(String nombre);
}