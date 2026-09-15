function cargarProductos() {
  const contenedor = document.getElementById("dashboard-content");
  let usuarioData = JSON.parse(localStorage.getItem("usuarioActivoMiPlata")) || {};

  const cliente = new Cliente(
    usuarioData.identificacion || "No registrada",
    usuarioData.fullName || "Usuario",
    usuarioData.celular || "No registrado",
    usuarioData.username || "usuario",
    usuarioData.password || ""
  );

  if (usuarioData.ahorrosSaldo) cliente.cuentaAhorros.consignar(usuarioData.ahorrosSaldo);
  if (usuarioData.corrienteSaldo) cliente.cuentaCorriente.consignar(usuarioData.corrienteSaldo);

  const tieneAhorros = usuarioData.cuentaAhorrosActiva === true;
  const tieneCorriente = usuarioData.cuentaCorrienteActiva === true;
  const tieneCredito = usuarioData.tarjetaCreditoActiva === true;

  contenedor.innerHTML = `
    <section class="content-section active" style="display: flex; flex-direction: column; gap: 2rem; margin-top: 1.5rem; padding: 1.5rem; color: var(--text-platinum);">
      <div class="section-header" style="text-align: left;">
        <h2>Gestión de Productos Bancarios</h2>
        <p>Adquiere tus cuentas de ahorros, corriente o tarjeta de crédito en Mi Plata.</p>
      </div>

      <div class="cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 350px)); gap: 1.5rem; justify-content: start;">
        
        <div class="product-card" style="background-color: var(--panel-teal); border: 1px solid var(--border-teal); padding: 1.5rem; border-radius: 12px; display: flex; flex-direction: column; gap: 1rem;">
          <h4>Cuenta de Ahorros</h4>
          <p class="product-balance">$${cliente.cuentaAhorros.getSaldo().toLocaleString('es-CO', { minimumFractionDigits: 2 })}</p>
          <small>Tasa de interés: 1.5% mensual al retirar</small>
          <button id="btn-activar-ahorros" style="cursor: pointer; border: none; padding: 0.6rem; font-weight: 600; border-radius: 6px; background-color: ${tieneAhorros ? '#28a745' : 'var(--accent-blue)'}; color: #fff;">
            ${tieneAhorros ? 'Cuenta Activa' : 'Solicitar Cuenta de Ahorros'}
          </button>
        </div>

        <div class="product-card" style="background-color: var(--panel-teal); border: 1px solid var(--border-teal); padding: 1.5rem; border-radius: 12px; display: flex; flex-direction: column; gap: 1rem;">
          <h4>Cuenta Corriente</h4>
          <p class="product-balance">$${cliente.cuentaCorriente.getSaldo().toLocaleString('es-CO', { minimumFractionDigits: 2 })}</p>
          <small>Incluye sobregiro del 20%</small>
          <button id="btn-activar-corriente" style="cursor: pointer; border: none; padding: 0.6rem; font-weight: 600; border-radius: 6px; background-color: ${tieneCorriente ? '#28a745' : 'var(--accent-blue)'}; color: #fff;">
            ${tieneCorriente ? 'Cuenta Activa' : 'Solicitar Cuenta Corriente'}
          </button>
        </div>

        <div class="product-card" style="background-color: var(--panel-teal); border: 1px solid var(--border-teal); padding: 1.5rem; border-radius: 12px; display: flex; flex-direction: column; gap: 1rem;">
          <h4>Tarjeta de Crédito</h4>
          <p class="product-balance">$${cliente.tarjetaCredito.getCupoDisponible().toLocaleString('es-CO', { minimumFractionDigits: 2 })} <small style="font-size:0.8rem">Cupo Disp.</small></p>
          <small>Financiación a cuotas con intereses</small>
          <button id="btn-activar-credito" style="cursor: pointer; border: none; padding: 0.6rem; font-weight: 600; border-radius: 6px; background-color: ${tieneCredito ? '#28a745' : 'var(--accent-blue)'}; color: #fff;">
            ${tieneCredito ? 'Tarjeta Activa' : 'Solicitar Tarjeta de Crédito'}
          </button>
        </div>

      </div>
    </section>
  `;

  document.getElementById("btn-activar-ahorros").addEventListener("click", () => {
    usuarioData.cuentaAhorrosActiva = true;
    guardarEstadoCliente(usuarioData, cliente);
    cargarProductos();
  });

  document.getElementById("btn-activar-corriente").addEventListener("click", () => {
    usuarioData.cuentaCorrienteActiva = true;
    guardarEstadoCliente(usuarioData, cliente);
    cargarProductos();
  });

  document.getElementById("btn-activar-credito").addEventListener("click", () => {
    usuarioData.tarjetaCreditoActiva = true;
    guardarEstadoCliente(usuarioData, cliente);
    cargarProductos();
  });
}

function guardarEstadoCliente(usuarioData, cliente) {
  // Guardamos el saldo actual obtenido directamente del método getSaldo() de la POO
  usuarioData.ahorrosSaldo = cliente.cuentaAhorros.getSaldo();
  usuarioData.corrienteSaldo = cliente.cuentaCorriente.getSaldo();
  
  // Guardamos también las propiedades de respaldo que lee Resumen
  usuarioData.saldoAhorros = cliente.cuentaAhorros.getSaldo();
  usuarioData.saldoCorriente = cliente.cuentaCorriente.getSaldo();

  localStorage.setItem("usuarioActivoMiPlata", JSON.stringify(usuarioData));

  let listaUsuarios = JSON.parse(localStorage.getItem("usuariosMiPlataList")) || [];
  listaUsuarios = listaUsuarios.map(u => u.username === usuarioData.username ? { ...u, ...usuarioData } : u);
  localStorage.setItem("usuariosMiPlataList", JSON.stringify(listaUsuarios));
}


function registrarMovimiento(usuarioData, tipo, producto, monto) {
  if (!usuarioData.movimientos) {
    usuarioData.movimientos = [];
  }

  const fechaActual = new Date().toLocaleString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  usuarioData.movimientos.push({
    fecha: fechaActual,
    tipo: tipo,       // "Consignación" o "Retiro"
    producto: producto, // "Cuenta de Ahorros" o "Cuenta Corriente"
    monto: monto
  });
}