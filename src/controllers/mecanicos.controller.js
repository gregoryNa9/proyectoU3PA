const Mecanico = require("../models/mecanicos");

exports.getAllMecanicos = async (req, res) => {
    try {
        const mecanicos = await Mecanico.find();
        res.json(mecanicos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener mecánicos", error });
    }
};

exports.createMecanico = async (req, res) => {
    try {
        const mecanico = new Mecanico(req.body);
        await mecanico.save();
        res.status(201).json({ message: "Mecánico creado", mecanico });
    } catch (error) {
        res.status(400).json({ message: "Error al crear mecánico", error });
    }
};

exports.updateMecanico = async (req, res) => {
    try {
        await Mecanico.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: "Mecánico actualizado" });
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar mecánico", error });
    }
};

exports.deleteMecanico = async (req, res) => {
    try {
        await Mecanico.findByIdAndDelete(req.params.id);
        res.json({ message: "Mecánico eliminado" });
    } catch (error) {
        res.status(400).json({ message: "Error al eliminar mecánico", error });
    }
};
