import React, { useState, useEffect } from 'react';
import { getMecanicos, addMecanico, updateMecanico, deleteMecanico } from '../services/api';

const Mecanicos = () => {
    const [mecanicos, setMecanicos] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        especialidad: '',
        experienciaAnios: '',
        telefono: '',
        email: ''
    });

    useEffect(() => {
        fetchMecanicos();
    }, []);

    const fetchMecanicos = async () => {
        const res = await getMecanicos();
        setMecanicos(res.data);
    };

    const handleAdd = () => {
        setFormData({
            nombre: '',
            especialidad: '',
            experienciaAnios: '',
            telefono: '',
            email: ''
        });
        setEditId(null);
        setFormVisible(true);
    };

    const handleEdit = (mecanico) => {
        setFormData({
            nombre: mecanico.nombre || '',
            especialidad: mecanico.especialidad || '',
            experienciaAnios: mecanico.experienciaAnios || '',
            telefono: mecanico.telefono || '',
            email: mecanico.email || ''
        });
        setEditId(mecanico._id);
        setFormVisible(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Eliminar mecánico?")) {
            await deleteMecanico(id);
            fetchMecanicos();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nombre.trim()) {
            alert("El nombre es obligatorio");
            return;
        }

        // Validación básica email si quieres (opcional)
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            alert("El email no es válido");
            return;
        }

        if (editId) {
            await updateMecanico(editId, formData);
        } else {
            await addMecanico(formData);
        }

        setFormVisible(false);
        fetchMecanicos();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="contenedor">
            <h2>Mecánicos</h2>
            <div className="btn-container">
                <button className="btn insertar" onClick={handleAdd}>Nuevo Mecánico</button>
            </div>

            <div className="cursos-grid">
                {mecanicos.map(mecanico => (
                    <div key={mecanico._id} className="card">
                        <h3>{mecanico.nombre}</h3>
                        <p><strong>Especialidad:</strong> {mecanico.especialidad}</p>
                        <p><strong>Años de experiencia:</strong> {mecanico.experienciaAnios}</p>
                        <p><strong>Teléfono:</strong> {mecanico.telefono}</p>
                        <p><strong>Email:</strong> {mecanico.email}</p>
                        <div className="acciones">
                            <button className="btn editar" onClick={() => handleEdit(mecanico)}>Editar</button>
                            <button className="btn eliminar" onClick={() => handleDelete(mecanico._id)}>Eliminar</button>
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
                            type="text"
                            name="especialidad"
                            placeholder="Especialidad"
                            value={formData.especialidad}
                            onChange={handleChange}
                        />
                        <input
                            type="number"
                            name="experienciaAnios"
                            placeholder="Años de experiencia"
                            value={formData.experienciaAnios}
                            onChange={handleChange}
                            min="0"
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

export default Mecanicos;
