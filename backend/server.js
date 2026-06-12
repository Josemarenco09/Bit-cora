const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Permitir comunicación con frontend
app.use(cors());
app.use(express.json());

// Configuración de conexión
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "marenco09",
    database: "contactos_db"
});

// Conectar a MySQL
db.connect((err) => {
    if (err) {
        console.error("Error de conexión:", err);
    } else {
        console.log("Conectado a MySQL");
    }
});

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("Servidor conectado a MySQL");
});


// RUTA PARA GUARDAR DATOS
app.post("/guardar", (req, res) => {

    const { nombre, correo, telefono, mensaje } = req.body;

    console.log("Datos recibidos:", req.body);

    if (!nombre || !correo || !telefono || !mensaje) {
        return res.status(400).send("Datos incompletos");
    }

    const sql = "INSERT INTO contactos (nombre, correo, telefono, mensaje) VALUES (?, ?, ?, ?)";

    db.query(sql, [nombre, correo, telefono, mensaje], (err, result) => {
        if (err) {
            console.error("Error SQL:", err);
            return res.status(500).send("Error en servidor");
        }

        console.log("Registro insertado:", result);
        res.send("Datos guardados correctamente");
    });
});

// RUTA PARA INICIAR SESION
app.post("/login", (req, res) => {

    const { email_user, password_user } = req.body;

    if (!email_user || !password_user) {
        return res.status(400).json({
            success: false,
            message: "Correo y contraseña son obligatorios"
        });
    }

    const sql = `
        SELECT id_user, email_user, rol_user
        FROM users
        WHERE email_user = ? AND password_user = ?
        LIMIT 1
    `;

    db.query(sql, [email_user, password_user], (err, result) => {
        if (err) {
            console.error("Error SQL login:", err);
            return res.status(500).json({
                success: false,
                message: "Error en el servidor"
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Correo o contraseña incorrectos"
            });
        }

        const usuario = result[0];

        res.json({
            success: true,
            message: "Inicio de sesión correcto",
            usuario: usuario
        });
    });
});

const db_product = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'marenco09',
    database: 'productos'
})

app.get("/productos", (req, res) => {
    const sql_product = "SELECT * FROM productos_tienda"

    db_product.query(sql_product, (err, result) => {
        if (err) {
            console.log("Error: ", err.message)
            return res.status(500).json({ message: "Error al consultar productos" });
        }
        res.json(result)
    })
})

// Iniciar servidor
app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000 de productos");
});
