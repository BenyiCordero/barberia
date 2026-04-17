package com.bcsystems.barberia_api.dto;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VentaDetalleDTO {
    private Integer idVentaDetalle;
    private Integer idVenta;
    private Integer idProducto;
    private String nombreProducto;
    private Integer idServicio;
    private String nombreServicio;
    private Integer cantidad;
    private Double precio;

    @JsonBackReference
    public Integer getIdVenta() {
        return idVenta;
    }
}