const API_BASE_URL = 'http://localhost:8091/api';

const API = {
    // Cliente
    clientes: {
        getAll: (page = 0, size = 10) => 
            fetch(`${API_BASE_URL}/clientes?page=${page}&size=${size}`).then(res => res.json()),
        getById: (id) => 
            fetch(`${API_BASE_URL}/clientes/${id}`).then(res => res.json()),
        create: (data) => 
            fetch(`${API_BASE_URL}/clientes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(res => res.json()),
        update: (id, data) => 
            fetch(`${API_BASE_URL}/clientes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(res => res.json()),
        delete: (id) => 
            fetch(`${API_BASE_URL}/clientes/${id}`, { method: 'DELETE' })
    },

    // Empleado
    empleados: {
        getAll: (page = 0, size = 10) => 
            fetch(`${API_BASE_URL}/empleados?page=${page}&size=${size}`).then(res => res.json()),
        getById: (id) => 
            fetch(`${API_BASE_URL}/empleados/${id}`).then(res => res.json()),
        create: (data) => 
            fetch(`${API_BASE_URL}/empleados`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(res => res.json()),
        update: (id, data) => 
            fetch(`${API_BASE_URL}/empleados/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(res => res.json()),
        delete: (id) => 
            fetch(`${API_BASE_URL}/empleados/${id}`, { method: 'DELETE' })
    },

    // Servicio
    servicios: {
        getAll: (page = 0, size = 10) => 
            fetch(`${API_BASE_URL}/servicios?page=${page}&size=${size}`).then(res => res.json()),
        getById: (id) => 
            fetch(`${API_BASE_URL}/servicios/${id}`).then(res => res.json()),
        create: (data) => 
            fetch(`${API_BASE_URL}/servicios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(res => res.json()),
        update: (id, data) => 
            fetch(`${API_BASE_URL}/servicios/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(res => res.json()),
        delete: (id) => 
            fetch(`${API_BASE_URL}/servicios/${id}`, { method: 'DELETE' })
    },

    // Producto
    productos: {
        getAll: (page = 0, size = 10) => 
            fetch(`${API_BASE_URL}/productos?page=${page}&size=${size}`).then(res => res.json()),
        getById: (id) => 
            fetch(`${API_BASE_URL}/productos/${id}`).then(res => res.json()),
        create: (data) => 
            fetch(`${API_BASE_URL}/productos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(res => res.json()),
        update: (id, data) => 
            fetch(`${API_BASE_URL}/productos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(res => res.json()),
        delete: (id) => 
            fetch(`${API_BASE_URL}/productos/${id}`, { method: 'DELETE' })
    },

    // Cita
    citas: {
        getAll: (page = 0, size = 10) => 
            fetch(`${API_BASE_URL}/citas?page=${page}&size=${size}`).then(res => res.json()),
        getById: (id) => 
            fetch(`${API_BASE_URL}/citas/${id}`).then(res => res.json()),
        create: (data) => 
            fetch(`${API_BASE_URL}/citas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(res => res.json()),
        update: (id, data) => 
            fetch(`${API_BASE_URL}/citas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(res => res.json()),
        delete: (id) => 
            fetch(`${API_BASE_URL}/citas/${id}`, { method: 'DELETE' })
    },

    // Venta
    ventas: {
        getAll: (page = 0, size = 10) => 
            fetch(`${API_BASE_URL}/ventas?page=${page}&size=${size}`).then(res => res.json()),
        getById: (id) => 
            fetch(`${API_BASE_URL}/ventas/${id}`).then(res => res.json()),
        create: (data) => 
            fetch(`${API_BASE_URL}/ventas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(res => res.json()),
        update: (id, data) => 
            fetch(`${API_BASE_URL}/ventas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(res => res.json()),
        delete: (id) => 
            fetch(`${API_BASE_URL}/ventas/${id}`, { method: 'DELETE' })
    },

    // Inventario
    inventario: {
        getAll: (page = 0, size = 10) => 
            fetch(`${API_BASE_URL}/inventario?page=${page}&size=${size}`).then(res => res.json()),
        getById: (id) => 
            fetch(`${API_BASE_URL}/inventario/${id}`).then(res => res.json()),
        create: (data) => 
            fetch(`${API_BASE_URL}/inventario`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(res => res.json()),
        delete: (id) => 
            fetch(`${API_BASE_URL}/inventario/${id}`, { method: 'DELETE' })
    },

    // Dashboard
    dashboard: {
        get: () => 
            fetch(`${API_BASE_URL}/dashboard`).then(res => res.json())
    }
};

// Funciones de utilidad
function formatCurrency(amount) {
    return '$' + parseFloat(amount || 0).toFixed(2);
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDateTimeLocal(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
}

function showToast(message, type = 'success') {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} show`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="toast-body">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
            ${message}
        </div>
    `;
    
    toastContainer.appendChild(toast);
    document.body.appendChild(toastContainer);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toastContainer.remove(), 300);
    }, 3000);
}

function showConfirmModal(title, message, onConfirm) {
    const modal = new bootstrap.Modal(document.getElementById('modal-confirmacion'));
    document.getElementById('confirmacion-titulo').textContent = title;
    document.getElementById('confirmacion-mensaje').textContent = message;
    
    const confirmBtn = document.getElementById('confirmacion-btn');
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    newConfirmBtn.addEventListener('click', () => {
        onConfirm();
        modal.hide();
    });
    
    modal.show();
}

function createPagination(currentPage, totalPages, onPageChange) {
    if (totalPages <= 1) return '';
    
    let paginationHtml = '';
    
    // Previous button
    paginationHtml += `<li class="page-item ${currentPage === 0 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage - 1}">
            <i class="fas fa-chevron-left"></i>
        </a>
    </li>`;
    
    // Page numbers
    for (let i = 0; i < totalPages; i++) {
        if (i === 0 || i === totalPages - 1 || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHtml += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i + 1}</a>
            </li>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHtml += `<li class="page-item disabled">
                <a class="page-link" href="#">...</a>
            </li>`;
        }
    }
    
    // Next button
    paginationHtml += `<li class="page-item ${currentPage >= totalPages - 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage + 1}">
            <i class="fas fa-chevron-right"></i>
        </a>
    </li>`;
    
    return paginationHtml;
}

function handleApiError(error) {
    console.error('API Error:', error);
    showToast('Error al comunicarse con el servidor', 'error');
}

// Exportar para uso global
window.API = API;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.formatDateTimeLocal = formatDateTimeLocal;
window.showToast = showToast;
window.showConfirmModal = showConfirmModal;
window.createPagination = createPagination;
window.handleApiError = handleApiError;