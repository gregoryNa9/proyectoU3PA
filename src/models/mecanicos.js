const mongoose = require("mongoose");

const mecanicoSchema = new mongoose.Schema({
    nombre: String,
    especialidad: String,     // Ejemplo: "Motor", "Transmisión", "Frenos"
    experienciaAnios: Number,
    telefono: String,
    email: String
});

module.exports = mongoose.model("Mecanico", mecanicoSchema);
