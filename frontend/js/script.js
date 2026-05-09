console.log("Script cargado correctamente");

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