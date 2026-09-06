function cargarConsignar() {
  const contenedor = document.getElementById("dashboard-content");
  let usuarioData = JSON.parse(localStorage.getItem("usuarioActivoMiPlata")) || {};

  contenedor.innerHTML = `
    <section class="content-section active" style="padding: 2rem; color: var(--text-platinum); max-width: 500px;">
      <h2>Consignar Dinero</h2>
      <p>Selecciona el producto al que deseas abonar fondos:</p>
      
      <form id="form-consignar" style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem;">
        <label>
          Seleccionar Producto:
          <select id="select-producto" style="width: 100%; padding: 0.5rem; margin-top: 0.3rem; background: #002b2b; color: #fff; border: 1px solid var(--border-teal);">
            ${usuarioData.cuentaAhorrosActiva ? '<option value="ahorros">Cuenta de Ahorros</option>' : ''}
            ${usuarioData.cuentaCorrienteActiva ? '<option value="corriente">Cuenta Corriente</option>' : ''}
          </select>
        </label>

        <label>
          Monto a Consignar ($):
          <input type="number" id="input-monto" min="1" step="any" placeholder="Ej. 50000" style="width: 100%; padding: 0.5rem; margin-top: 0.3rem;" required>
        </label>

        <button type="submit" class="btn-primary" style="padding: 0.7rem; background-color: var(--accent-blue); color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
          Realizar Consignación
        </button>
      </form>
      <div id="resultado-consignacion" style="margin-top: 1rem; font-weight: bold;"></div>
    </section>
  `;

  document.getElementById("form-consignar").addEventListener("submit", (e) => {
    e.preventDefault();
    const selectEl = document.getElementById("select-producto");
    const mensajeDiv = document.getElementById("resultado-consignacion");

    if (!selectEl || selectEl.options.length === 0) {
      mensajeDiv.style.color = "#ff4d4d";
      mensajeDiv.textContent = "No tienes cuentas activas. Ve a la sección 'Productos' para solicitar una.";
      return;
    }

    const tipo = selectEl.value;
    const monto = parseFloat(document.getElementById("input-monto").value);

    try {
      if (isNaN(monto) || monto <= 0) {
        throw new Error("El monto debe ser un número positivo mayor a cero.");
      }

      const cliente = new Cliente(
        usuarioData.identificacion || "No registrada",
        usuarioData.fullName || "Usuario",
        usuarioData.celular || "No registrado",
        usuarioData.username || "usuario",
        usuarioData.password || ""
      );

      // RESTAURAR LOS SALDOS EXISTENTES ANTES DE OPERAR
      if (usuarioData.ahorrosSaldo) {
        cliente.cuentaAhorros.consignar(usuarioData.ahorrosSaldo);
      } else if (usuarioData.ahorrosSaldo === 0) {
        // Mantiene en 0 si ya fue inicializado
      }

      if (usuarioData.corrienteSaldo) {
        cliente.cuentaCorriente.consignar(usuarioData.corrienteSaldo);
      }

      // Ahora sí aplicamos la nueva consignación mediante el método de la clase
      if (tipo === "ahorros") {
        cliente.cuentaAhorros.consignar(monto);
      } else if (tipo === "corriente") {
        cliente.cuentaCorriente.consignar(monto);
      }

      // Guardamos el estado actualizado
      guardarEstadoCliente(usuarioData, cliente);

      mensajeDiv.style.color = "#28a745";
      mensajeDiv.textContent = "¡Consignación exitosa! Saldo actualizado.";
      
      document.getElementById("input-monto").value = "";
    } catch (error) {
      mensajeDiv.style.color = "#ff4d4d";
      mensajeDiv.textContent = error.message;
    }
  });
}