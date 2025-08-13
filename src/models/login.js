const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
    nombre: String,
    correo: String,
    pass: String
});

module.exports = mongoose.model("User", loginSchema);