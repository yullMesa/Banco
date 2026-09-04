document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const mensajeError = document.getElementById("mensaje-error");
  const mensajeExito = document.getElementById("mensaje-exito-login");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("login-email").value.trim().toLowerCase();
    const passwordInput = document.getElementById("login-password").value;

    // 1. Recuperamos la lista de usuarios del localStorage
    let listaUsuarios = JSON.parse(localStorage.getItem("usuariosMiPlataList")) || [];

    // 2. Buscamos al usuario por su correo
    const usuarioIndex = listaUsuarios.findIndex(user => user.email === emailInput);

    if (usuarioIndex === -1) {
      mensajeError.textContent = "Correo o contraseña incorrectos.";
      mensajeError.style.display = "block";
      return;
    }

    let usuario = listaUsuarios[usuarioIndex];

    // 3. Verificamos si la cuenta ya se encuentra bloqueada por exceder los intentos
    if (usuario.bloqueado) {
      mensajeError.textContent = "Cuenta bloqueada temporalmente por seguridad tras 3 intentos fallidos.";
      mensajeError.style.display = "block";
      return;
    }

    // Aseguramos que el contador exista
    if (usuario.intentosFallidos === undefined) {
      usuario.intentosFallidos = 0;
    }

    // 4. Validamos las credenciales
    if (usuario.password === passwordInput) {
      // ¡Éxito! Reseteamos los intentos fallidos a 0 al entrar correctamente
      usuario.intentosFallidos = 0;
      listaUsuarios[usuarioIndex] = usuario;
      localStorage.setItem("usuariosMiPlataList", JSON.stringify(listaUsuarios));

      // Guardamos la sesión activa
      localStorage.setItem("usuarioActivoMiPlata", JSON.stringify(usuario));

      mensajeError.style.display = "none";
      form.style.display = "none";
      mensajeExito.style.display = "block";

      setTimeout(() => {
        window.location.href = "../pages/dashboard.html"; 
      }, 2000);

    } else {
      // Contraseña incorrecta: sumamos un intento fallido
      usuario.intentosFallidos += 1;
      let intentosRestantes = 3 - usuario.intentosFallidos;

      if (usuario.intentosFallidos >= 3) {
        usuario.bloqueado = true;
        mensajeError.textContent = "Has superado los 3 intentos permitidos. Tu cuenta ha sido bloqueada.";
      } else {
        mensajeError.textContent = `Contraseña incorrecta. Te quedan ${intentosRestantes} intento(s) antes de que la cuenta se bloquee.`;
      }

      // Actualizamos la lista en el localStorage con el nuevo estado de intentos
      listaUsuarios[usuarioIndex] = usuario;
      localStorage.setItem("usuariosMiPlataList", JSON.stringify(listaUsuarios));

      mensajeError.style.display = "block";
    }
  });
});