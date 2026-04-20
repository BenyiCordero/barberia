package com.bcsystems.barberia_api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DashboardDTO {
    private Double ventasDia;
    private Double ventasSemana;
    private Double ventasMes;
    private Long totalCitasDia;
    private Long totalCitasSemana;
    private Long totalCitasMes;
    private Double gananciasNetas;
    private Double totalComisiones;
    private List<ProductoVendidoDTO> productosMasVendidos;
    private List<CitasEmpleadoDTO> citasPorEmpleado;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProductoVendidoDTO {
        private Integer idProducto;
        private String nombre;
        private Integer cantidadVendida;
        private Double totalVendido;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CitasEmpleadoDTO {
        private Integer idEmpleado;
        private String nombreEmpleado;
        private Long totalCitas;
        private Double totalServicios;
    }
}