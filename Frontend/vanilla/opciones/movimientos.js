function cargarMovimientos() {
  const contenedor = document.getElementById("dashboard-content");
  let usuarioData = JSON.parse(localStorage.getItem("usuarioActivoMiPlata")) || {};
  
  // Obtenemos los movimientos guardados del usuario (o array vacío)
  const movimientos = usuarioData.movimientos || [];

  let filasHTML = "";

  if (movimientos.length === 0) {
    filasHTML = `
      <tr>
        <td colspan="4" style="text-align: center; padding: 2rem; color: #aaa;">
          No hay movimientos registrados todavía. Realiza una consignación o retiro.
        </td>
      </tr>
    `;
  } else {
    // Recorremos los movimientos del más reciente al más antiguo
    filasHTML = movimientos.slice().reverse().map(m => `
      <tr>
        <td>${m.fecha}</td>
        <td>
          <span class="badge-tipo ${m.tipo === 'Consignación' ? 'badge-consignacion' : 'badge-retiro'}">
            ${m.tipo}
          </span>
        </td>
        <td>${m.producto}</td>
        <td style="font-weight: bold; color: ${m.tipo === 'Consignación' ? '#28a745' : '#ff4d4d'};">
          ${m.tipo === 'Consignación' ? '+' : '-'}$${m.monto.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
        </td>
      </tr>
    `).join('');
  }

  contenedor.innerHTML = `
    <section class="content-section active" style="padding: 2rem; color: var(--text-platinum);">
      <h2>Historial de Movimientos</h2>
      <p>Consulta el registro detallado de tus transacciones bancarias.</p>
      
      <div class="table-container">
        <table class="movimientos-table">
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>Tipo</th>
              <th>Producto</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            ${filasHTML}
          </tbody>
        </table>
      </div>
    </section>
  `;
}