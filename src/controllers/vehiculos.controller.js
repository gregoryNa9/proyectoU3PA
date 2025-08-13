const Vehiculo = require("../models/vehiculos");

exports.getAllVehiculos = async (req, res) => {
    try {
        const vehiculos = await Vehiculo.find().populate("clienteId", "nombre telefono email");
        res.json(vehiculos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener vehículos", error });
    }
};

exports.createVehiculo = async (req, res) => {
    try {
        const { placa } = req.body;

        const placaRegex = /^[A-Z]{3}-\d{4}$/;
        if (!placaRegex.test(placa)) {
            return res.status(400).json({ message: "Formato de placa inválido. Debe ser ABC-1234." });
        }

        const vehiculo = new Vehiculo(req.body);
        await vehiculo.save();
        res.status(201).json({ message: "Vehículo creado", vehiculo });
    } catch (error) {
        res.status(400).json({ message: "Error al crear vehículo", error });
    }
};

exports.updateVehiculo = async (req, res) => {
    try {
        await Vehiculo.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: "Vehículo actualizado" });
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar vehículo", error });
    }
};

exports.deleteVehiculo = async (req, res) => {
    try {
        await Vehiculo.findByIdAndDelete(req.params.id);
        res.json({ message: "Vehículo eliminado" });
    } catch (error) {
        res.status(400).json({ message: "Error al eliminar vehículo", error });
    }
};
