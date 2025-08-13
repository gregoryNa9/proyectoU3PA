import React, { useState, useEffect } from 'react';
import { getVehiculos, addVehiculo, updateVehiculo, deleteVehiculo, getClientes } from '../services/api';

const Vehiculos = () => {
    const [vehiculos, setVehiculos] = useState([]);
    const [clientes, setClientes] = useState([]); // Para cargar clientes y seleccionar clienteId
    const [formVisible, setFormVisible] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        placa: '',
        marca: '',
        modelo: '',
        anio: '',
        color: '',
        clienteId: ''
    });

    useEffect(() => {
        fetchVehiculos();
        fetchClientes();
    }, []);

    const fetchVehiculos = async () => {
        const res = await getVehiculos();
        setVehiculos(res.data);
    };

    const fetchClientes = async () => {
        const res = await getClientes();
        setClientes(res.data);
    };

    const handleAdd = () => {
        setFormData({
            placa: '',
            marca: '',
            modelo: '',
            anio: '',
            color: '',
            clienteId: ''
        });
        setEditId(null);
        setFormVisible(true);
    };

    const handleEdit = (vehiculo) => {
        setFormData({
            placa: vehiculo.placa,
            marca: vehiculo.marca,
            modelo: vehiculo.modelo,
            anio: vehiculo.anio,
            color: vehiculo.color || '',
            clienteId: vehiculo.clienteId || ''
        });
        setEditId(vehiculo._id);
        setFormVisible(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Eliminar vehículo?")) {
            await deleteVehiculo(id);
            fetchVehiculos();
        }
    };

    const validatePlaca = (placa) => {
        const regex = /^[A-Z]{3}-\d{4}$/;
        return regex.test(placa);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.placa.trim() || !formData.marca.trim() || !formData.clienteId) {
            alert("La placa, marca y cliente son obligatorios");
            return;
        }

        if (!validatePlaca(formData.placa)) {
            alert("La placa debe tener el formato ABC-1234 (tres letras mayúsculas, guion, cuatro números)");
            return;
        }

        if (editId) {
            await updateVehiculo(editId, formData);
        } else {
            await addVehiculo(formData);
        }

        setFormVisible(false);
        fetchVehiculos();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="contenedor">
            <h2>Vehículos</h2>
            <div className="btn-container">
                <button className="btn insertar" onClick={handleAdd}>Nuevo Vehículo</button>
            </div>

            <div className="cursos-grid">
                {vehiculos.map((vehiculo) => (
                    <div key={vehiculo._id} className="card">
                        <h3>{vehiculo.placa}</h3>
                        <p><strong>Marca:</strong> {vehiculo.marca}</p>
                        <p><strong>Modelo:</strong> {vehiculo.modelo}</p>
                        <p><strong>Año:</strong> {vehiculo.anio}</p>
                        <p><strong>Color:</strong> {vehiculo.color}</p>
                        <p><strong>Cliente ID:</strong> {typeof vehiculo.clienteId === 'object' ? vehiculo.clienteId._id || '' : vehiculo.clienteId}</p>
                        <div className="acciones">
                            <button className="btn editar" onClick={() => handleEdit(vehiculo)}>Editar</button>
                            <button className="btn eliminar" onClick={() => handleDelete(vehiculo._id)}>Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>

            {formVisible && (
                <div className="modal">
                    <form className="formulario" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="placa"
                            placeholder="Placa (ABC-1234)"
                            value={formData.placa}
                            onChange={handleChange}
                            required
                            maxLength={8}
                        />
                        <input
                            type="text"
                            name="marca"
                            placeholder="Marca"
                            value={formData.marca}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="modelo"
                            placeholder="Modelo"
                            value={formData.modelo}
                            onChange={handleChange}
                        />
                        <input
                            type="number"
                            name="anio"
                            placeholder="Año"
                            value={formData.anio}
                            onChange={handleChange}
                            min="1900"
                            max={new Date().getFullYear()}
                        />
                        <input
                            type="text"
                            name="color"
                            placeholder="Color"
                            value={formData.color}
                            onChange={handleChange}
                        />

                        <select
                            name="clienteId"
                            value={formData.clienteId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un cliente</option>
                            {clientes.map(cliente => (
                                <option key={cliente._id} value={cliente._id}>
                                    {typeof cliente.nombre === 'object' && cliente.nombre !== null
                                        ? `${cliente.nombre.primerNombre || ''} ${cliente.nombre.apellido || ''}`.trim()
                                        : cliente.nombre || cliente.email || cliente._id
                                    }
                                </option>
                            ))}
                        </select>

                        <div className="btn-container-modal">
                            <button type="submit" className="btn insertar">Guardar</button>
                            <button type="button" className="btn eliminar" onClick={() => setFormVisible(false)}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Vehiculos;
