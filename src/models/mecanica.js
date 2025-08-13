const mongoose = require("mongoose");

const citaSchema = new mongoose.Schema({
    citaId: String,
    
    vehiculoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehiculo",
        required: true
    },
    mecanicoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mecanico",
        required: true
    },
    clienteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cliente",
        required: true
    },

    // 🔹 Campos visibles que vamos a mostrar en el frontend y guardar en Mongo
    clienteNombre: {
        type: String,
        required: true
    },
    vehiculoPlaca: {
        type: String,
        required: true
    },
    mecanicoNombre: {
        type: String,
        required: true
    },

    fechaCita: {
        type: Date,
        required: true
    },
    horaInicio: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):00$/ // Solo horas en formato HH:00 (ejemplo "08:00", "14:00")
    },
    duracionHoras: {
        type: Number,
        default: 2,
        min: 1,
        max: 2
    },
    servicio: {
        type: String,
        default: ""
    },
    observaciones: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("Cita", citaSchema);
