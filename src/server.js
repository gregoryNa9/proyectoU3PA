require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const clientesRoutes = require("./routes/clientes.routes");
const vehiculosRoutes = require("./routes/vehiculos.routes");
const mecanicosRoutes = require("./routes/mecanicos.routes");
const mecanicaRoutes = require("./routes/mecanica.routes"); // citas

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/clientes", clientesRoutes);
app.use("/vehiculos", vehiculosRoutes);
app.use("/mecanicos", mecanicosRoutes);
app.use("/citas", mecanicaRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Conexión exitosa a MongoDB");
    app.listen(process.env.PORT, () =>
      console.log(`Servidor iniciado en puerto ${process.env.PORT}`)
    );
  })
  .catch((error) => console.error("Error de conexión a MongoDB:", error));
