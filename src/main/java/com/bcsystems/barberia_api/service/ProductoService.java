package com.bcsystems.barberia_api.service;

import com.bcsystems.barberia_api.domain.MovimientoInventario;
import com.bcsystems.barberia_api.domain.Producto;
import com.bcsystems.barberia_api.domain.en.TipoMovimiento;
import com.bcsystems.barberia_api.dto.ProductoDTO;
import com.bcsystems.barberia_api.repository.MovimientoInventarioRepository;
import com.bcsystems.barberia_api.repository.ProductoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final MovimientoInventarioRepository movimientoRepository;

    public ProductoService(ProductoRepository productoRepository, MovimientoInventarioRepository movimientoRepository) {
        this.productoRepository = productoRepository;
        this.movimientoRepository = movimientoRepository;
    }

    @Transactional(readOnly = true)
    public Page<ProductoDTO> findAll(Pageable pageable) {
        return productoRepository.findByStatus(1, pageable).map(this::toDTO);
    }

    @Transactional(readOnly = true)
    public Optional<ProductoDTO> findById(Integer id) {
        return productoRepository.findById(id).map(this::toDTO);
    }

    @Transactional
    public ProductoDTO save(ProductoDTO dto) {
        Producto producto = toEntity(dto);
        Producto saved = productoRepository.save(producto);
        
        if (saved.getStock() != null && saved.getStock() > 0) {
            MovimientoInventario movimiento = new MovimientoInventario();
            movimiento.setProducto(saved);
            movimiento.setCantidad(saved.getStock());
            movimiento.setTipoMovimiento(TipoMovimiento.ENTRADA);
            movimiento.setFecha(LocalDateTime.now());
            movimiento.setMotivo("Stock inicial");
            movimientoRepository.save(movimiento);
        }
        
        return toDTO(saved);
    }

    @Transactional
    public ProductoDTO update(Integer id, ProductoDTO dto) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecioCompra(dto.getPrecioCompra());
        producto.setPrecioVenta(dto.getPrecioVenta());
        producto.setStock(dto.getStock());
        return toDTO(productoRepository.save(producto));
    }

    @Transactional
    public void delete(Integer id) {
        if (!productoRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrado");
        }
        productoRepository.deleteById(id);
    }

    private ProductoDTO toDTO(Producto producto) {
        return new ProductoDTO(
                producto.getIdProducto(),
                producto.getNombre(),
                producto.getDescripcion(),
                producto.getPrecioCompra(),
                producto.getPrecioVenta(),
                producto.getStock(),
                producto.getStatus()
        );
    }

    private Producto toEntity(ProductoDTO dto) {
        Producto producto = new Producto();
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecioCompra(dto.getPrecioCompra());
        producto.setPrecioVenta(dto.getPrecioVenta());
        producto.setStock(dto.getStock());
        return producto;
    }
}