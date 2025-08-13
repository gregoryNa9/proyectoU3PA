const Cliente = require("../models/clientes");

exports.getAllClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener clientes", error });
    }
};

exports.createCliente = async (req, res) => {
    try {
        const cliente = new Cliente(req.body);
        await cliente.save();
        res.status(201).json({ message: "Cliente creado", cliente });
    } catch (error) {
        res.status(400).json({ message: "Error al crear cliente", error });
    }
};

exports.updateCliente = async (req, res) => {
    try {
        await Cliente.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: "Cliente actualizado" });
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar cliente", error });
    }
};

exports.deleteCliente = async (req, res) => {
    try {
        await Cliente.findByIdAndDelete(req.params.id);
        res.json({ message: "Cliente eliminado" });
    } catch (error) {
        res.status(400).json({ message: "Error al eliminar cliente", error });
    }
};
