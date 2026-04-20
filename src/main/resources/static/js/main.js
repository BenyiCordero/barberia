// Variables globales para paginación
let currentPages = {
    clientes: 0,
    empleados: 0,
    servicios: 0,
    productos: 0,
    citas: 0,
    ventas: 0,
    inventario: 0
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    loadDashboard();
    loadClientes(0);
    loadEmpleados(0);
    loadServicios(0);
    loadProductos(0);
    loadCitas(0);
    loadVentas(0);
    loadInventario(0);
    initForms();
});

// Navegación
function initNavigation() {
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            showPage(page);
            
            // Actualizar clase active
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById('page-' + pageId)?.classList.add('active');
    
    // Cargar datos según la página
    switch(pageId) {
        case 'dashboard': loadDashboard(); break;
        case 'clientes': loadClientes(currentPages.clientes); break;
        case 'empleados': loadEmpleados(currentPages.empleados); break;
        case 'servicios': loadServicios(currentPages.servicios); break;
        case 'productos': loadProductos(currentPages.productos); break;
        case 'citas': loadCitas(currentPages.citas); break;
        case 'ventas': loadVentas(currentPages.ventas); break;
        case 'inventario': loadInventario(currentPages.inventario); break;
    }
}

// ============ DASHBOARD ============
function loadDashboard() {
    API.dashboard.get()
        .then(data => {
            document.getElementById('ventas-dia').textContent = formatCurrency(data.ventasDia);
            document.getElementById('citas-dia').textContent = data.totalCitasDia || 0;
            document.getElementById('ventas-semana').textContent = formatCurrency(data.ventasSemana);
            document.getElementById('ganancias-netas').textContent = formatCurrency(data.gananciasNetas);
            
            // Productos más vendidos
            const productosContainer = document.getElementById('productos-mas-vendidos');
            if (data.productosMasVendidos && data.productosMasVendidos.length > 0) {
                let html = '<table class="table table-sm"><thead><tr><th>Producto</th><th>Cantidad</th><th>Total</th></tr></thead><tbody>';
                data.productosMasVendidos.slice(0, 5).forEach(p => {
                    html += `<tr><td>${p.nombre}</td><td>${p.cantidadVendida}</td><td class="price">${formatCurrency(p.totalVendido)}</td></tr>`;
                });
                html += '</tbody></table>';
                productosContainer.innerHTML = html;
            } else {
                productosContainer.innerHTML = '<p class="text-muted text-center">No hay productos vendidos</p>';
            }
            
            // Citas por empleado
            const citasContainer = document.getElementById('citas-empleado');
            if (data.citasPorEmpleado && data.citasPorEmpleado.length > 0) {
                let html = '<table class="table table-sm"><thead><tr><th>Empleado</th><th>Citas</th></tr></thead><tbody>';
                data.citasPorEmpleado.forEach(c => {
                    html += `<tr><td>${c.nombreEmpleado}</td><td><span class="badge badge-completed">${c.totalCitas}</span></td></tr>`;
                });
                html += '</tbody></table>';
                citasContainer.innerHTML = html;
            } else {
                citasContainer.innerHTML = '<p class="text-muted text-center">No hay citas registradas</p>';
            }
        })
        .catch(handleApiError);
}

// ============ CLIENTES ============
function loadClientes(page = 0) {
    currentPages.clientes = page;
    API.clientes.getAll(page, 10)
        .then(data => {
            const tbody = document.getElementById('clientes-tbody');
            if (data.content && data.content.length > 0) {
                tbody.innerHTML = data.content.map(c => `
                    <tr>
                        <td>${c.idCliente}</td>
                        <td>${c.nombre}</td>
                        <td>${c.telefono}</td>
                        <td class="date-text">${formatDate(c.fechaRegistro)}</td>
                        <td>
                            <button class="btn btn-action btn-edit" onclick="editCliente(${c.idCliente})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-action btn-delete" onclick="deleteCliente(${c.idCliente})" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            } else {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay clientes registrados</td></tr>';
            }
            
            document.getElementById('clientes-pagination').innerHTML = createPagination(page, data.totalPages, (p) => loadClientes(p));
        })
        .catch(handleApiError);
}

function editCliente(id) {
    API.clientes.getById(id)
        .then(data => {
            document.getElementById('cliente-id').value = data.idCliente;
            document.getElementById('cliente-nombre').value = data.nombre;
            document.getElementById('cliente-telefono').value = data.telefono;
            document.getElementById('modal-cliente-titulo').textContent = 'Editar Cliente';
            new bootstrap.Modal(document.getElementById('modal-cliente')).show();
        })
        .catch(handleApiError);
}

function deleteCliente(id) {
    showConfirmModal('Eliminar Cliente', '¿Estás seguro de que deseas eliminar este cliente?', () => {
        API.clientes.delete(id)
            .then(() => {
                showToast('Cliente eliminado correctamente');
                loadClientes(currentPages.clientes);
            })
            .catch(handleApiError);
    });
}

// ============ EMPLEADOS ============
function loadEmpleados(page = 0) {
    currentPages.empleados = page;
    API.empleados.getAll(page, 10)
        .then(data => {
            const tbody = document.getElementById('empleados-tbody');
            if (data.content && data.content.length > 0) {
                tbody.innerHTML = data.content.map(e => `
                    <tr>
                        <td>${e.idEmpleado}</td>
                        <td>${e.nombre}</td>
                        <td>${e.telefono}</td>
                        <td>${e.porcentajeComision}%</td>
                        <td><span class="badge ${e.status === 1 ? 'badge-active' : 'badge-inactive'}">${e.status === 1 ? 'Activo' : 'Inactivo'}</span></td>
                        <td>
                            <button class="btn btn-action btn-edit" onclick="editEmpleado(${e.idEmpleado})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-action btn-delete" onclick="deleteEmpleado(${e.idEmpleado})" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            } else {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay empleados registrados</td></tr>';
            }
            
            document.getElementById('empleados-pagination').innerHTML = createPagination(page, data.totalPages, (p) => loadEmpleados(p));
        })
        .catch(handleApiError);
}

function editEmpleado(id) {
    API.empleados.getById(id)
        .then(data => {
            document.getElementById('empleado-id').value = data.idEmpleado;
            document.getElementById('empleado-nombre').value = data.nombre;
            document.getElementById('empleado-telefono').value = data.telefono;
            document.getElementById('empleado-comision').value = data.porcentajeComision;
            document.getElementById('modal-empleado-titulo').textContent = 'Editar Empleado';
            new bootstrap.Modal(document.getElementById('modal-empleado')).show();
        })
        .catch(handleApiError);
}

function deleteEmpleado(id) {
    showConfirmModal('Eliminar Empleado', '¿Estás seguro de que deseas eliminar este empleado?', () => {
        API.empleados.delete(id)
            .then(() => {
                showToast('Empleado eliminado correctamente');
                loadEmpleados(currentPages.empleados);
            })
            .catch(handleApiError);
    });
}

// ============ SERVICIOS ============
function loadServicios(page = 0) {
    currentPages.servicios = page;
    API.servicios.getAll(page, 10)
        .then(data => {
            const tbody = document.getElementById('servicios-tbody');
            if (data.content && data.content.length > 0) {
                tbody.innerHTML = data.content.map(s => `
                    <tr>
                        <td>${s.idServicio}</td>
                        <td>${s.nombre}</td>
                        <td>${s.descripcion || '-'}</td>
                        <td>${s.duracionMinutos} min</td>
                        <td class="price">${formatCurrency(s.precio)}</td>
                        <td><span class="badge ${s.status === 1 ? 'badge-active' : 'badge-inactive'}">${s.status === 1 ? 'Activo' : 'Inactivo'}</span></td>
                        <td>
                            <button class="btn btn-action btn-edit" onclick="editServicio(${s.idServicio})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-action btn-delete" onclick="deleteServicio(${s.idServicio})" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            } else {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No hay servicios registrados</td></tr>';
            }
            
            document.getElementById('servicios-pagination').innerHTML = createPagination(page, data.totalPages, (p) => loadServicios(p));
        })
        .catch(handleApiError);
}

function editServicio(id) {
    API.servicios.getById(id)
        .then(data => {
            document.getElementById('servicio-id').value = data.idServicio;
            document.getElementById('servicio-nombre').value = data.nombre;
            document.getElementById('servicio-descripcion').value = data.descripcion || '';
            document.getElementById('servicio-duracion').value = data.duracionMinutos;
            document.getElementById('servicio-precio').value = data.precio;
            document.getElementById('modal-servicio-titulo').textContent = 'Editar Servicio';
            new bootstrap.Modal(document.getElementById('modal-servicio')).show();
        })
        .catch(handleApiError);
}

function deleteServicio(id) {
    showConfirmModal('Eliminar Servicio', '¿Estás seguro de que deseas eliminar este servicio?', () => {
        API.servicios.delete(id)
            .then(() => {
                showToast('Servicio eliminado correctamente');
                loadServicios(currentPages.servicios);
            })
            .catch(handleApiError);
    });
}

// ============ PRODUCTOS ============
function loadProductos(page = 0) {
    currentPages.productos = page;
    API.productos.getAll(page, 10)
        .then(data => {
            const tbody = document.getElementById('productos-tbody');
            if (data.content && data.content.length > 0) {
                tbody.innerHTML = data.content.map(p => `
                    <tr>
                        <td>${p.idProducto}</td>
                        <td>${p.nombre}</td>
                        <td>${p.descripcion || '-'}</td>
                        <td>${formatCurrency(p.precioCompra)}</td>
                        <td class="price">${formatCurrency(p.precioVenta)}</td>
                        <td><span class="badge ${p.stock > 0 ? 'badge-active' : 'badge-inactive'}">${p.stock} unidades</span></td>
                        <td>
                            <button class="btn btn-action btn-edit" onclick="editProducto(${p.idProducto})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-action btn-delete" onclick="deleteProducto(${p.idProducto})" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            } else {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No hay productos registrados</td></tr>';
            }
            
            document.getElementById('productos-pagination').innerHTML = createPagination(page, data.totalPages, (p) => loadProductos(p));
        })
        .catch(handleApiError);
}

function editProducto(id) {
    API.productos.getById(id)
        .then(data => {
            document.getElementById('producto-id').value = data.idProducto;
            document.getElementById('producto-nombre').value = data.nombre;
            document.getElementById('producto-descripcion').value = data.descripcion || '';
            document.getElementById('producto-precio-compra').value = data.precioCompra;
            document.getElementById('producto-precio-venta').value = data.precioVenta;
            document.getElementById('producto-stock').value = data.stock;
            document.getElementById('modal-producto-titulo').textContent = 'Editar Producto';
            new bootstrap.Modal(document.getElementById('modal-producto')).show();
        })
        .catch(handleApiError);
}

function deleteProducto(id) {
    showConfirmModal('Eliminar Producto', '¿Estás seguro de que deseas eliminar este producto?', () => {
        API.productos.delete(id)
            .then(() => {
                showToast('Producto eliminado correctamente');
                loadProductos(currentPages.productos);
            })
            .catch(handleApiError);
    });
}

// ============ CITAS ============
function loadCitas(page = 0) {
    currentPages.citas = page;
    API.citas.getAll(page, 10)
        .then(data => {
            const tbody = document.getElementById('citas-tbody');
            if (data.content && data.content.length > 0) {
                tbody.innerHTML = data.content.map(c => `
                    <tr>
                        <td>${c.idCita}</td>
                        <td>${c.nombreCliente || '-'}</td>
                        <td>${c.nombreEmpleado || '-'}</td>
                        <td class="date-text">${formatDate(c.fechaInicio)}</td>
                        <td class="date-text">${formatDate(c.fechaFin)}</td>
                        <td><span class="badge badge-${c.estado.toLowerCase()}">${c.estado}</span></td>
                        <td>
                            <button class="btn btn-action btn-edit" onclick="editCita(${c.idCita})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-action btn-delete" onclick="deleteCita(${c.idCita})" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            } else {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No hay citas registradas</td></tr>';
            }
            
            document.getElementById('citas-pagination').innerHTML = createPagination(page, data.totalPages, (p) => loadCitas(p));
        })
        .catch(handleApiError);
}

function editCita(id) {
    Promise.all([
        API.citas.getById(id),
        API.clientes.getAll(0, 100),
        API.empleados.getAll(0, 100),
        API.servicios.getAll(0, 100)
    ])
    .then(([cita, clientes, empleados, servicios]) => {
        document.getElementById('cita-id').value = cita.idCita;
        
        // Llenar select de clientes
        const clienteSelect = document.getElementById('cita-cliente');
        clienteSelect.innerHTML = clientes.content.map(cl => 
            `<option value="${cl.idCliente}" ${cita.idCliente === cl.idCliente ? 'selected' : ''}>${cl.nombre}</option>`
        ).join('');
        
        // Llenar select de empleados
        const empleadoSelect = document.getElementById('cita-empleado');
        empleadoSelect.innerHTML = empleados.content.map(em => 
            `<option value="${em.idEmpleado}" ${cita.idEmpleado === em.idEmpleado ? 'selected' : ''}>${em.nombre}</option>`
        ).join('');
        
        document.getElementById('cita-fecha-inicio').value = formatDateTimeLocal(cita.fechaInicio);
        document.getElementById('cita-fecha-fin').value = formatDateTimeLocal(cita.fechaFin);
        document.getElementById('cita-estado').value = cita.estado;
        
        // Cargar checkboxes de servicios
        const serviciosContainer = document.getElementById('cita-servicios-checkboxes');
        serviciosContainer.innerHTML = servicios.content.map(s => {
            const selected = cita.detalles && cita.detalles.some(d => d.idServicio === s.idServicio);
            return `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="${s.idServicio}" ${selected ? 'checked' : ''}>
                    <label class="form-check-label">${s.nombre} - ${formatCurrency(s.precio)}</label>
                </div>
            `;
        }).join('');
        
        document.getElementById('modal-cita-titulo').textContent = 'Editar Cita';
        new bootstrap.Modal(document.getElementById('modal-cita')).show();
    })
    .catch(handleApiError);
}

function deleteCita(id) {
    showConfirmModal('Eliminar Cita', '¿Estás seguro de que deseas eliminar esta cita?', () => {
        API.citas.delete(id)
            .then(() => {
                showToast('Cita eliminada correctamente');
                loadCitas(currentPages.citas);
            })
            .catch(handleApiError);
    });
}

// ============ VENTAS ============
function loadVentas(page = 0) {
    currentPages.ventas = page;
    API.ventas.getAll(page, 10)
        .then(data => {
            const tbody = document.getElementById('ventas-tbody');
            if (data.content && data.content.length > 0) {
                tbody.innerHTML = data.content.map(v => `
                    <tr>
                        <td>${v.idVenta}</td>
                        <td class="date-text">${formatDate(v.fecha)}</td>
                        <td class="price">${formatCurrency(v.total)}</td>
                        <td>${v.idCita ? '#' + v.idCita : '-'}</td>
                        <td>
                            <button class="btn btn-action btn-delete" onclick="deleteVenta(${v.idVenta})" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            } else {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay ventas registradas</td></tr>';
            }
            
            document.getElementById('ventas-pagination').innerHTML = createPagination(page, data.totalPages, (p) => loadVentas(p));
        })
        .catch(handleApiError);
}

function deleteVenta(id) {
    showConfirmModal('Eliminar Venta', '¿Estás seguro de que deseas eliminar esta venta?', () => {
        API.ventas.delete(id)
            .then(() => {
                showToast('Venta eliminada correctamente');
                loadVentas(currentPages.ventas);
            })
            .catch(handleApiError);
    });
}

// ============ INVENTARIO ============
function loadInventario(page = 0) {
    currentPages.inventario = page;
    API.productos.getAll(page, 10)
        .then(data => {
            const tbody = document.getElementById('inventario-tbody');
            if (data.content && data.content.length > 0) {
                tbody.innerHTML = data.content.map(p => `
                    <tr>
                        <td>${p.idProducto}</td>
                        <td>${p.nombre}</td>
                        <td>${p.descripcion || '-'}</td>
                        <td class="price">${formatCurrency(p.precioVenta)}</td>
                        <td><span class="badge ${p.stock > 0 ? 'badge-active' : 'badge-inactive'}">${p.stock} unidades</span></td>
                        <td>
                            <button class="btn btn-action btn-edit" onclick="editProducto(${p.idProducto})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            } else {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay productos en inventario</td></tr>';
            }
            
            document.getElementById('inventario-pagination').innerHTML = createPagination(page, data.totalPages, (p) => loadInventario(p));
        })
        .catch(handleApiError);
}

function deleteMovimiento(id) {
    showConfirmModal('Eliminar Movimiento', '¿Estás seguro de que deseas eliminar este movimiento?', () => {
        API.inventario.delete(id)
            .then(() => {
                showToast('Movimiento eliminado correctamente');
                loadInventario(currentPages.inventario);
            })
            .catch(handleApiError);
    });
}

// ============ FORMULARIOS ============
function initForms() {
    // Cliente
    document.getElementById('form-cliente').addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('cliente-id').value;
        const data = {
            nombre: document.getElementById('cliente-nombre').value,
            telefono: document.getElementById('cliente-telefono').value
        };
        
        const action = id ? API.clientes.update(id, data) : API.clientes.create(data);
        action
            .then(() => {
                showToast(id ? 'Cliente actualizado correctamente' : 'Cliente creado correctamente');
                bootstrap.Modal.getInstance(document.getElementById('modal-cliente')).hide();
                this.reset();
                document.getElementById('cliente-id').value = '';
                loadClientes(currentPages.clientes);
            })
            .catch(handleApiError);
    });

    // Empleado
    document.getElementById('form-empleado').addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('empleado-id').value;
        const data = {
            nombre: document.getElementById('empleado-nombre').value,
            telefono: document.getElementById('empleado-telefono').value,
            porcentajeComision: parseFloat(document.getElementById('empleado-comision').value)
        };
        
        const action = id ? API.empleados.update(id, data) : API.empleados.create(data);
        action
            .then(() => {
                showToast(id ? 'Empleado actualizado correctamente' : 'Empleado creado correctamente');
                bootstrap.Modal.getInstance(document.getElementById('modal-empleado')).hide();
                this.reset();
                document.getElementById('empleado-id').value = '';
                loadEmpleados(currentPages.empleados);
            })
            .catch(handleApiError);
    });

    // Servicio
    document.getElementById('form-servicio').addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('servicio-id').value;
        const data = {
            nombre: document.getElementById('servicio-nombre').value,
            descripcion: document.getElementById('servicio-descripcion').value,
            duracionMinutos: parseInt(document.getElementById('servicio-duracion').value),
            precio: parseFloat(document.getElementById('servicio-precio').value)
        };
        
        const action = id ? API.servicios.update(id, data) : API.servicios.create(data);
        action
            .then(() => {
                showToast(id ? 'Servicio actualizado correctamente' : 'Servicio creado correctamente');
                bootstrap.Modal.getInstance(document.getElementById('modal-servicio')).hide();
                this.reset();
                document.getElementById('servicio-id').value = '';
                loadServicios(currentPages.servicios);
            })
            .catch(handleApiError);
    });

    // Producto
    document.getElementById('form-producto').addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('producto-id').value;
        const data = {
            nombre: document.getElementById('producto-nombre').value,
            descripcion: document.getElementById('producto-descripcion').value,
            precioCompra: parseFloat(document.getElementById('producto-precio-compra').value),
            precioVenta: parseFloat(document.getElementById('producto-precio-venta').value),
            stock: parseInt(document.getElementById('producto-stock').value)
        };
        
        const action = id ? API.productos.update(id, data) : API.productos.create(data);
        action
            .then(() => {
                showToast(id ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
                bootstrap.Modal.getInstance(document.getElementById('modal-producto')).hide();
                this.reset();
                document.getElementById('producto-id').value = '';
                loadProductos(currentPages.productos);
            })
            .catch(handleApiError);
    });

// Cita - usando form-modal que es el ID correcto en el HTML
    const citaForm = document.getElementById('form-modal');
    if (citaForm) {
        function handleCitaSubmit(e) {
            e.preventDefault();
            const id = document.getElementById('cita-id').value;
            
            const servicios = [];
            document.querySelectorAll('#cita-servicios-checkboxes input:checked').forEach(cb => {
                servicios.push({ idServicio: parseInt(cb.value) });
            });
            
            const data = {
                idCliente: parseInt(document.getElementById('cita-cliente').value),
                idEmpleado: parseInt(document.getElementById('cita-empleado').value),
                fechaInicio: document.getElementById('cita-fecha-inicio').value,
                fechaFin: document.getElementById('cita-fecha-fin').value,
                estado: document.getElementById('cita-estado').value,
                detalles: servicios
            };
            
            console.log('Enviando cita:', data);
            
            const action = id ? API.citas.update(id, data) : API.citas.create(data);
            action
                .then(() => {
                    showToast(id ? 'Cita actualizada correctamente' : 'Cita creada correctamente');
                    const modalElement = document.getElementById('modal-modal');
                    const bsModal = bootstrap.Modal.getInstance(modalElement);
                    if (bsModal) bsModal.hide();
                    document.getElementById('form-modal').reset();
                    document.getElementById('cita-id').value = '';
                    loadCitas(currentPages.citas);
                })
                .catch(err => {
                    console.error('Error al crear cita:', err);
                    handleApiError(err);
                });
        }
        citaForm.addEventListener('submit', handleCitaSubmit);
    }

// Venta - Función para manejar el submit
    const ventaForm = document.getElementById('form-venta');
    if (ventaForm) {
        function handleVentaSubmit(e) {
            e.preventDefault();
            
            // Recolectar items
            const items = [];
            document.querySelectorAll('#venta-items-tbody tr').forEach(row => {
                const tipo = row.getAttribute('data-tipo');
                const id = parseInt(row.getAttribute('data-id'));
                const cantidad = parseInt(row.getAttribute('data-cantidad'));
                const precio = parseFloat(row.getAttribute('data-precio'));
                
                if (tipo === 'producto') {
                    items.push({ idProducto: id, cantidad: cantidad, precio: precio });
                } else {
                    items.push({ idServicio: id, cantidad: cantidad, precio: precio });
                }
            });
            
            if (items.length === 0) {
                showToast('Agrega al menos un producto o servicio', 'warning');
                return;
            }
            
            const idCitaEl = document.getElementById('modal-venta').querySelector('select[id*="cita"]');
            const idCita = idCitaEl ? idCitaEl.value : null;
            
            const data = {
                idCita: idCita ? parseInt(idCita) : null,
                detalles: items
            };
            
            console.log('Enviando venta:', data);
            
            API.ventas.create(data)
                .then(() => {
                    showToast('Venta creada correctamente');
                    const modal = document.getElementById('modal-venta');
                    const bsModal = bootstrap.Modal.getInstance(modal);
                    if (bsModal) {
                        bsModal.hide();
                    }
                    document.getElementById('form-venta').reset();
                    document.getElementById('venta-items-tbody').innerHTML = '';
                    document.getElementById('venta-total').textContent = '$0.00';
                    loadVentas(currentPages.ventas);
                    loadDashboard();
                })
                .catch(err => {
                    console.error('Error al crear venta:', err);
                    handleApiError(err);
                });
        }
        ventaForm.addEventListener('submit', handleVentaSubmit);
    }

    // Cambio de tipo de item en venta
    document.getElementById('venta-tipo-item').addEventListener('change', function() {
        const tipo = this.value;
        const select = document.getElementById('venta-item-select');
        if (tipo === 'producto') {
            API.productos.getAll(0, 100)
                .then(data => {
                    select.innerHTML = data.content.map(p => 
                        `<option value="${p.idProducto}" data-precio="${p.precioVenta}">${p.nombre} (Stock: ${p.stock})</option>`
                    ).join('');
                });
        } else {
            API.servicios.getAll(0, 100)
                .then(data => {
                    select.innerHTML = data.content.map(s => 
                        `<option value="${s.idServicio}" data-precio="${s.precio}">${s.nombre}</option>`
                    ).join('');
                });
        }
    });

    // Agregar item a la venta
    document.getElementById('btn-agregar-item').addEventListener('click', function() {
        const tipo = document.getElementById('venta-tipo-item').value;
        const select = document.getElementById('venta-item-select');
        const cantidad = parseInt(document.getElementById('venta-cantidad').value);
        const option = select.options[select.selectedIndex];
        const precio = parseFloat(option.getAttribute('data-precio'));
        const nombre = option.text.split(' (')[0];
        
        const tbody = document.getElementById('venta-items-tbody');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tipo === 'producto' ? '<i class="fas fa-box"></i> Producto' : '<i class="fas fa-scissors"></i> Servicio'}</td>
            <td>${nombre}</td>
            <td>${cantidad}</td>
            <td>${formatCurrency(precio)}</td>
            <td>${formatCurrency(precio * cantidad)}</td>
            <td><button class="btn btn-sm btn-delete" onclick="this.closest('tr').remove(); actualizarTotalVenta();"><i class="fas fa-times"></i></button></td>
        `;
        row.setAttribute('data-tipo', tipo);
        row.setAttribute('data-id', select.value);
        row.setAttribute('data-cantidad', cantidad);
        row.setAttribute('data-precio', precio);
        tbody.appendChild(row);
        
        actualizarTotalVenta();
    });

    // Cargar opciones iniciales de venta cuando se abre el modal
    document.getElementById('modal-venta').addEventListener('show.bs.modal', function() {
        // Cargar citas
        API.citas.getAll(0, 100)
            .then(data => {
                const select = document.getElementById('venta-cita');
                select.innerHTML = '<option value="">Sin cita</option>' + 
                    data.content.map(c => `<option value="${c.idCita}">${c.nombreCliente} - ${formatDate(c.fechaInicio)}</option>`).join('');
            });
        
        // Cargar productos por defecto
        API.productos.getAll(0, 100)
            .then(data => {
                document.getElementById('venta-item-select').innerHTML = data.content.map(p => 
                    `<option value="${p.idProducto}" data-precio="${p.precioVenta}">${p.nombre} (Stock: ${p.stock})</option>`
                ).join('');
            });
    });

    function actualizarTotalVenta() {
        let total = 0;
        document.querySelectorAll('#venta-items-tbody tr').forEach(row => {
            const cantidad = parseInt(row.getAttribute('data-cantidad'));
            const precio = parseFloat(row.getAttribute('data-precio'));
            total += cantidad * precio;
        });
        document.getElementById('venta-total').textContent = formatCurrency(total);
    }

    // Movimiento Inventario
    document.getElementById('form-movimiento').addEventListener('submit', function(e) {
        e.preventDefault();
        const data = {
            idProducto: parseInt(document.getElementById('movimiento-producto').value),
            tipoMovimiento: document.getElementById('movimiento-tipo').value,
            cantidad: parseInt(document.getElementById('movimiento-cantidad').value),
            motivo: document.getElementById('movimiento-motivo').value
        };
        
        API.inventario.create(data)
            .then(() => {
                showToast('Movimiento creado correctamente');
                bootstrap.Modal.getInstance(document.getElementById('modal-movimiento')).hide();
                this.reset();
                loadInventario(currentPages.inventario);
            })
            .catch(handleApiError);
    });

    // Cargar selects dependientes cuando se abre el modal de cita
    document.getElementById('modal-cita').addEventListener('show.bs.modal', function() {
        if (!document.getElementById('cita-cliente').options.length) {
            Promise.all([
                API.clientes.getAll(0, 100),
                API.empleados.getAll(0, 100),
                API.servicios.getAll(0, 100)
            ]).then(([clientes, empleados, servicios]) => {
                document.getElementById('cita-cliente').innerHTML = clientes.content.map(c => 
                    `<option value="${c.idCliente}">${c.nombre}</option>`
                ).join('');
                
                document.getElementById('cita-empleado').innerHTML = empleados.content.map(e => 
                    `<option value="${e.idEmpleado}">${e.nombre}</option>`
                ).join('');
                
                document.getElementById('cita-servicios-checkboxes').innerHTML = servicios.content.map(s => `
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="${s.idServicio}">
                        <label class="form-check-label">${s.nombre} - ${formatCurrency(s.precio)}</label>
                    </div>
                `).join('');
            });
        }
    });

    // Cargar productos en movimiento
    document.getElementById('modal-movimiento').addEventListener('show.bs.modal', function() {
        if (!document.getElementById('movimiento-producto').options.length) {
            API.productos.getAll(0, 100)
                .then(data => {
                    document.getElementById('movimiento-producto').innerHTML = data.content.map(p => 
                        `<option value="${p.idProducto}">${p.nombre} (Stock: ${p.stock})</option>`
                    ).join('');
                });
        }
    });

    // Limpiar modales al cerrar
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('hidden.bs.modal', function() {
            const form = this.querySelector('form');
            if (form) {
                form.reset();
                form.querySelectorAll('input[type="hidden"]').forEach(input => input.value = '');
            }
            const titles = this.querySelectorAll('[id$="-titulo"]');
            titles.forEach(title => {
                if (title.id.includes('cliente')) title.textContent = 'Nuevo Cliente';
                if (title.id.includes('empleado')) title.textContent = 'Nuevo Empleado';
                if (title.id.includes('servicio')) title.textContent = 'Nuevo Servicio';
                if (title.id.includes('producto')) title.textContent = 'Nuevo Producto';
                if (title.id.includes('cita')) title.textContent = 'Nueva Cita';
            });
        });
    });
}

// Funciones globales para usar en onclick
window.editCliente = editCliente;
window.deleteCliente = deleteCliente;
window.editEmpleado = editEmpleado;
window.deleteEmpleado = deleteEmpleado;
window.editServicio = editServicio;
window.deleteServicio = deleteServicio;
window.editProducto = editProducto;
window.deleteProducto = deleteProducto;
window.editCita = editCita;
window.deleteCita = deleteCita;
window.deleteVenta = deleteVenta;
window.deleteMovimiento = deleteMovimiento;