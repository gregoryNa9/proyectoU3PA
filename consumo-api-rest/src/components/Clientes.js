import React, { useState, useEffect } from 'react';
import { getClientes, addCliente, updateCliente, deleteCliente } from '../services/api';

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        email: ''
    });

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        const res = await getClientes();
        setClientes(res.data);
    };

    const handleAdd = () => {
        setFormData({ nombre: '', telefono: '', email: '' });
        setEditId(null);
        setFormVisible(true);
    };

    const handleEdit = (cliente) => {
        setFormData({
            nombre: cliente.nombre,
            telefono: cliente.telefono,
            email: cliente.email
        });
        setEditId(cliente._id);
        setFormVisible(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Eliminar cliente?")) {
            await deleteCliente(id);
            fetchClientes();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.nombre.trim()) {
            alert("El nombre es obligatorio");
            return;
        }
        if (editId) {
            await updateCliente(editId, formData);
        } else {
            await addCliente(formData);
        }
        setFormVisible(false);
        fetchClientes();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="contenedor">
            <h2>Clientes</h2>
            <div className="btn-container">
                <button className="btn insertar" onClick={handleAdd}>Nuevo Cliente</button>
            </div>

            <div className="cursos-grid">
                {clientes.map(cliente => (
                    <div key={cliente._id} className="card">
                        <h3>{cliente.nombre}</h3>
                        <p><strong>Teléfono:</strong> {cliente.telefono}</p>
                        <p><strong>Email:</strong> {cliente.email}</p>
                        <div className="acciones">
                            <button className="btn editar" onClick={() => handleEdit(cliente)}>Editar</button>
                            <button className="btn eliminar" onClick={() => handleDelete(cliente._id)}>Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>

            {formVisible && (
                <div className="modal">
                    <form className="formulario" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="tel"
                            name="telefono"
                            placeholder="Teléfono"
                            value={formData.telefono}
                            onChange={handleChange}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
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

export default Clientes;
