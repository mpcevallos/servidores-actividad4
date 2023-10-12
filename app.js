const express = require("express");

const app = express();

require("./config/db.config");

app.use(express.json());

app.use((req, res, next) => {
  console.log("request received:", req.method, req.path);
  next();
});

const router = require("./config/router.config");
app.use(router);

app.listen(8000, () => {
  console.log("Servidor conectado al puerto 8000");
});
