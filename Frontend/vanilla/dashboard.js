document.addEventListener("DOMContentLoaded", () => {
  // Cargar por defecto la vista de resumen al entrar al dashboard
  if (typeof cargarResumen === "function") {
    cargarResumen();
  }

  // Capturar los botones del menú lateral dinámicamente
  // Asegúrate de tener esto en tu listener del menú lateral en dashboard.js
const botonesNav = document.querySelectorAll(".nav-item");

  botonesNav.forEach(boton => {
    boton.addEventListener("click", (e) => {
      // Usamos currentTarget para asegurar que agarre el botón completo aunque hagas clic en los bordes
      const targetBtn = e.currentTarget;
      
      // 1. Quitar la clase active de todos y ponérsela al actual
      botonesNav.forEach(b => b.classList.remove("active"));
      targetBtn.classList.add("active");

      // 2. Leer la sección usando el atributo data-target del HTML
      const seccion = targetBtn.dataset.target;

      // 3. Enrutar limpiamente según el destino
      if (seccion === "resumen") {
        if (typeof cargarResumen === "function") cargarResumen();
      } else if (seccion === "consignar") {
        if (typeof cargarConsignar === "function") cargarConsignar();
      } else if (seccion === "productos") {
        if (typeof cargarProductos === "function") cargarProductos();
      } else if (seccion === "retirar") {
        if (typeof cargarRetirar === "function") cargarRetirar();
      } else if (seccion === "movimientos") {
        if (typeof cargarMovimientos === "function") cargarMovimientos();
      } else if (seccion === "transferir") {
        if (typeof cargarTransferir === "function") cargarTransferir();
      } else if (seccion === "perfil") {
        if (typeof cargarPerfil === "function") cargarPerfil();
      } else {
        document.getElementById("dashboard-content").innerHTML = `
          <div style="padding: 2rem; color: var(--text-platinum);">
            <h2>Módulo en construcción...</h2>
          </div>
        `;
      }
    });
  });
});