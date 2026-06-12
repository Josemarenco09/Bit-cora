console.log("Script cargado correctamente");

// Mostrar boton de cerrar sesion cuando existe un usuario logeado
const usuarioGuardado = localStorage.getItem("usuario");
const menu = document.querySelector(".menu ul");

if (menu && usuarioGuardado) {
    const enlaceLogin = menu.querySelector('a[href="login.html"]');

    if (enlaceLogin) {
        const itemLogin = enlaceLogin.parentElement;

        itemLogin.innerHTML = `
            <button type="button" id="cerrarSesion" class="boton-cerrar-sesion">
                Cerrar sesion
            </button>
        `;

        const botonCerrarSesion = document.getElementById("cerrarSesion");

        botonCerrarSesion.addEventListener("click", function() {
            localStorage.removeItem("usuario");
            window.location.href = "login.html";
        });
    }
}

// Capturar formulario
const formulario = document.getElementById("formulario");

if (formulario) {

    formulario.addEventListener("submit", function(event) {

        event.preventDefault();

        console.log("Evento submit ejecutado");

        const nombre   = document.getElementById("nombre").value.trim();
        const correo   = document.getElementById("correo").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const mensaje  = document.getElementById("mensaje").value.trim();

        console.log("Nombre:",   nombre);
        console.log("Correo:",   correo);
        console.log("Teléfono:", telefono);
        console.log("Mensaje:",  mensaje);

        const respuesta = document.getElementById("respuesta");

        respuesta.textContent = "";

        // Validación
        if (nombre === "" || correo === "" || telefono === "" || mensaje === "") {
            respuesta.style.color = "red";
            respuesta.textContent = "Todos los campos son obligatorios.";
            return;
        }

        // Deshabilitar botón mientras se envía
        const boton = formulario.querySelector("button[type='submit']");
        boton.disabled = true;
        boton.textContent = "Enviando...";

        // ENVIAR AL BACKEND
        fetch("http://localhost:3000/guardar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nombre, correo, telefono, mensaje })
        })
        .then(res => res.text())
        .then(data => {
            console.log("Respuesta servidor:", data);

            // 1. Mostrar mensaje de éxito
            respuesta.style.color = "green";
            respuesta.textContent = "✅ Datos guardados correctamente en MySQL.";

            setTimeout(() => {
                formulario.reset();
                respuesta.textContent = "";
            }, 3000);
        })
        .catch(error => {
            console.error("Error:", error);
            respuesta.style.color = "red";
            respuesta.textContent = "❌ Error al guardar los datos. Verifica que el servidor esté activo.";
        })
        .finally(() => {
            // Rehabilitar botón
            boton.disabled = false;
            boton.textContent = "Enviar";
        });

    });
}

// Capturar formulario de login
const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const email_user = document.getElementById("email_user").value.trim();
        const password_user = document.getElementById("password_user").value.trim();
        const mensajeLogin = document.getElementById("mensajeLogin");
        const boton = loginForm.querySelector("button[type='submit']");

        mensajeLogin.className = "mt-3";
        mensajeLogin.textContent = "";

        // Validacion basica antes de enviar al servidor
        if (email_user === "" || password_user === "") {
            mensajeLogin.classList.add("alert", "alert-danger");
            mensajeLogin.textContent = "Correo y contraseña son obligatorios.";
            return;
        }

        boton.disabled = true;
        boton.textContent = "Ingresando...";

        fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email_user, password_user })
        })
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                mensajeLogin.classList.add("alert", "alert-danger");
                mensajeLogin.textContent = data.message;
                return;
            }

            localStorage.setItem("usuario", JSON.stringify(data.usuario));

            mensajeLogin.classList.add("alert", "alert-success");
            mensajeLogin.textContent = "Bienvenido " + data.usuario.email_user + ". Rol: " + data.usuario.rol_user;

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        })
        .catch(error => {
            console.error("Error login:", error);
            mensajeLogin.classList.add("alert", "alert-danger");
            mensajeLogin.textContent = "Error al iniciar sesion. Verifica que el servidor este activo.";
        })
        .finally(() => {
            boton.disabled = false;
            boton.textContent = "Ingresar";
        });
    });
}
