const mongoose = require("mongoose");

const clienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    telefono: String,
    email: String
});

module.exports = mongoose.model("Cliente", clienteSchema);
