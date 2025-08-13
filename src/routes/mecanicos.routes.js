const express = require("express");
const router = express.Router();
const mecanicosController = require("../controllers/mecanicos.controller");

router.get("/", mecanicosController.getAllMecanicos);
router.post("/", mecanicosController.createMecanico);
router.put("/:id", mecanicosController.updateMecanico);
router.delete("/:id", mecanicosController.deleteMecanico);

module.exports = router;
