function cargarRetirar() {
  const contenedor = document.getElementById("dashboard-content");
  let usuarioData = JSON.parse(localStorage.getItem("usuarioActivoMiPlata")) || {};

  contenedor.innerHTML = `
    <section class="content-section active" style="padding: 2rem; color: var(--text-platinum); max-width: 500px;">
      <h2>Retirar Dinero</h2>
      <p>Selecciona el producto desde el cual deseas realizar el retiro:</p>
      
      <form id="form-retirar" style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem;">
        <label>
          Seleccionar Producto:
          <select id="select-producto-retiro" style="width: 100%; padding: 0.5rem; margin-top: 0.3rem; background: #002b2b; color: #fff; border: 1px solid var(--border-teal);">
            ${usuarioData.cuentaAhorrosActiva ? '<option value="ahorros">Cuenta de Ahorros (Aplica 1.5% int.)</option>' : ''}
            ${usuarioData.cuentaCorrienteActiva ? '<option value="corriente">Cuenta Corriente (Permite 20% sobregiro)</option>' : ''}
          </select>
        </label>

        <label>
          Monto a Retirar ($):
          <input type="number" id="input-monto-retiro" min="1" step="any" placeholder="Ej. 50000" style="width: 100%; padding: 0.5rem; margin-top: 0.3rem;" required>
        </label>

        <button type="submit" class="btn-primary" style="padding: 0.7rem; background-color: var(--accent-blue); color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
          Confirmar Retiro
        </button>
      </form>
      <div id="resultado-retiro" style="margin-top: 1rem; font-weight: bold;"></div>
    </section>
  `;

  document.getElementById("form-retirar").addEventListener("submit", (e) => {
    e.preventDefault();
    const selectEl = document.getElementById("select-producto-retiro");
    const mensajeDiv = document.getElementById("resultado-retiro");

    if (!selectEl || selectEl.options.length === 0) {
      mensajeDiv.style.color = "#ff4d4d";
      mensajeDiv.textContent = "No tienes cuentas activas para retirar. Activa una en la sección 'Productos'.";
      return;
    }

    const tipo = selectEl.value;
    const monto = parseFloat(document.getElementById("input-monto-retiro").value);

    try {
      if (isNaN(monto) || monto <= 0) {
        throw new Error("El monto a retirar debe ser mayor a cero.");
      }

      // Reconstruimos el objeto Cliente por POO
      const cliente = new Cliente(
        usuarioData.identificacion || "No registrada",
        usuarioData.fullName || "Usuario",
        usuarioData.celular || "No registrado",
        usuarioData.username || "usuario",
        usuarioData.password || ""
      );

      // Sincronizar saldos previos almacenados
      // Sincronizar saldos previos correctamente SIN invocar consignar()
      if (usuarioData.ahorrosSaldo) {
        cliente.cuentaAhorros.consignar(usuarioData.ahorrosSaldo);
      }
      
      // CAMBIO AQUÍ: Asignamos directamente el saldo corriente sin pasar por consignar()
      if (usuarioData.corrienteSaldo) {
        cliente.cuentaCorriente._saldo = usuarioData.corrienteSaldo;
      }

      let mensajeExito = "";

      // Ejecución del método POLIMÓRFICO retirar() definido en las clases
      if (tipo === "ahorros") {
        const resultado = cliente.cuentaAhorros.retirar(monto); // Aplica el 1.5%
        usuarioData.ahorrosSaldo = cliente.cuentaAhorros.getSaldo();
        mensajeExito = `¡Retiro exitoso! Se aplicó un interés de $${resultado.interesCobrado.toFixed(2)}. Nuevo saldo: $${resultado.nuevoSaldo.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`;
      } else if (tipo === "corriente") {
        const resultado = cliente.cuentaCorriente.retirar(monto); // Valida sobregiro
        usuarioData.corrienteSaldo = cliente.cuentaCorriente.getSaldo();
        mensajeExito = `¡Retiro exitoso! Nuevo saldo: $${resultado.nuevoSaldo.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`;
      }

      // Guardar cambios en LocalStorage
      guardarEstadoCliente(usuarioData, cliente);

      mensajeDiv.style.color = "#28a745";
      mensajeDiv.textContent = mensajeExito;
      document.getElementById("input-monto-retiro").value = "";

    } catch (error) {
      mensajeDiv.style.color = "#ff4d4d";
      mensajeDiv.textContent = error.message;
    }
  });
}