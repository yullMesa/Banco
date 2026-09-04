document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");
  const mensajeExito = document.getElementById("mensaje-exito");

  // Creamos un contenedor visual para mensajes de error en el registro si no existe
  let mensajeErrorRegistro = document.getElementById("mensaje-error-registro");
  if (!mensajeErrorRegistro) {
    mensajeErrorRegistro = document.createElement("div");
    mensajeErrorRegistro.id = "mensaje-error-registro";
    mensajeErrorRegistro.className = "error-message";
    mensajeErrorRegistro.style.display = "none";
    form.prepend(mensajeErrorRegistro);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // 1. Manipulación de Strings: Normalizamos a minúsculas y eliminamos espacios en blanco
    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    // 2. Obtenemos la lista actual de usuarios del localStorage (o un array vacío si no hay ninguno)
    let listaUsuarios = JSON.parse(localStorage.getItem("usuariosMiPlataList")) || [];

    // 3. Verificamos si el correo ya se encuentra registrado
    const usuarioExistente = listaUsuarios.find(user => user.email === email);

    if (usuarioExistente) {
      mensajeErrorRegistro.textContent = "El correo electrónico ya está registrado. Usa otro o inicia sesión.";
      mensajeErrorRegistro.style.display = "block";
      return; // Detenemos el registro
    }

    // 4. Si no existe, ocultamos errores y agregamos el nuevo usuario al arreglo
    mensajeErrorRegistro.style.display = "none";

    const nuevoUsuario = {
      fullname: fullname,
      email: email,
      password: password,
      fechaRegistro: new Date().toISOString()
    };

    listaUsuarios.push(nuevoUsuario);

    // Guardamos la lista actualizada en el localStorage
    localStorage.setItem("usuariosMiPlataList", JSON.stringify(listaUsuarios));

    // Feedback visual de éxito
    form.style.display = "none";
    mensajeExito.style.display = "block";

    setTimeout(() => {
      window.location.href = "../pages/Login.html";
    }, 2000);
  });
});