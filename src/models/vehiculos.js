const mongoose = require("mongoose");

const vehiculoSchema = new mongoose.Schema({
    placa: {
        type: String,
        unique: true,
        required: true,
        match: /^[A-Z]{3}-\d{4}$/  // Validación para formato ABC-1234
    },
    marca: String,
    modelo: String,
    anio: Number,
    color: String,
    clienteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cliente",
        required: true
    }
});

module.exports = mongoose.model("Vehiculo", vehiculoSchema);
