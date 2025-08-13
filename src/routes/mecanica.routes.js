const express = require("express");
const router = express.Router();
const mecanicaController = require("../controllers/mecanica.controller");

router.get("/", mecanicaController.getAllCitas);
router.post("/", mecanicaController.createCita);
router.put("/:id", mecanicaController.updateCita);
router.delete("/:id", mecanicaController.deleteCita);

module.exports = router;
