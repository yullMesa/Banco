document.addEventListener("DOMContentLoaded", () => {
  // 1. Validar que exista una sesión activa
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivoMiPlata"));
  if (!usuarioActivo) {
    window.location.href = "Login.html";
    return;
  }

  // 2. Mostrar el nombre completo del usuario en el topbar
  const nombreDisplay = document.getElementById("nombre-usuario-display");
  if (nombreDisplay) {
    nombreDisplay.textContent = usuarioActivo.fullname || "Usuario";
  }

  // 3. Cargar la sección de Resumen por defecto al entrar
  if (typeof cargarResumen === "function") {
    cargarResumen();
  }

  // 4. Manejar la navegación dinámica del menú lateral
  const botonesNav = document.querySelectorAll(".nav-item[data-target]");
  botonesNav.forEach(boton => {
    boton.addEventListener("click", (e) => {
      botonesNav.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");

      const target = e.target.getAttribute("data-target");
      
      // Enrutamiento modular por archivo JS
      if (target === "resumen" && typeof cargarResumen === "function") {
        cargarResumen();
      } else {
        document.getElementById("dashboard-content").innerHTML = `
          <div style="text-align: center; padding: 3rem;">
            <h3>Módulo de ${target.toUpperCase()} en construcción...</h3>
          </div>
        `;
      }
    });
  });

  // 5. Cerrar sesión
  const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
      localStorage.removeItem("usuarioActivoMiPlata");
      window.location.href = "Login.html";
    });
  }
});