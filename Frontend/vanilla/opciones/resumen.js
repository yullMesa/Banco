function cargarResumen() {
  const contenedor = document.getElementById("dashboard-content");
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivoMiPlata")) || {};

  const saldoAhorros = usuarioActivo.saldoAhorros || 0.00;
  const saldoCorriente = usuarioActivo.saldoCorriente || 0.00;
  const cupoCredito = usuarioActivo.cupoCredito || 0.00;

  contenedor.innerHTML = `
    <section class="content-section active" style="display: flex; flex-direction: column; gap: 2rem; margin-top: 1.5rem;">
      
      <!-- Tarjeta de Resumen de Datos del Cliente -->
      <div class="user-welcome-banner" style="background-color: var(--panel-teal); border: 1px solid var(--border-teal); padding: 1.5rem 2rem; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h3 style="margin: 0; color: var(--text-platinum); font-size: 1.3rem;">Información del Titular</h3>
          <p style="margin: 0.3rem 0 0 0; color: oklch(75% 0.01 240); font-size: 0.9rem;">
            Identificación: ${usuarioActivo.identificacion || 'No registrada'} | Celular: ${usuarioActivo.celular || 'No registrado'}
          </p>
        </div>
        <div style="background-color: var(--bg-onyx); padding: 0.6rem 1rem; border-radius: 8px; border: 1px solid var(--border-teal);">
          <span style="font-size: 0.85rem; color: var(--accent-blue); font-weight: 600;">Usuario: @${usuarioActivo.username || 'usuario'}</span>
        </div>
      </div>

      <!-- Sección de Productos Bancarios -->
      <div>
        <h3 style="margin-bottom: 1rem; font-size: 1.2rem; color: var(--text-platinum);">Tus Productos Bancarios</h3>
        <div class="cards-grid">
          <div class="product-card">
            <h4>Cuenta de Ahorros</h4>
            <p class="product-balance">$${saldoAhorros.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</p>
            <small>Tasa de interés: 1.5% mensual al retirar[cite: 2]</small>
          </div>
          <div class="product-card">
            <h4>Cuenta Corriente</h4>
            <p class="product-balance">$${saldoCorriente.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</p>
            <small>Incluye sobregiro del 20%[cite: 2]</small>
          </div>
          <div class="product-card">
            <h4>Tarjeta de Crédito</h4>
            <p class="product-balance">$${cupoCredito.toLocaleString('es-CO', { minimumFractionDigits: 2 })} <small>Cupo utilizado</small></p>
            <small>Financiación a cuotas con intereses[cite: 2]</small>
          </div>
        </div>
      </div>

    </section>
  `;
}