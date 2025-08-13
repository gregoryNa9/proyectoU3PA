import React, { useState, useEffect } from 'react';
import { getCitas, addCita, deleteCita, getMecanicos, getClientes, getVehiculos } from '../services/api';

const Citas = () => {
    const [citas, setCitas] = useState([]);
    const [mecanicos, setMecanicos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        clienteId: '',
        vehiculoId: '',
        mecanicoId: '',
        fechaCita: '',
        horaInicio: '08:00',
        duracionHoras: 2,
        servicio: '',
        observaciones: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [citasRes, mecanicosRes, clientesRes, vehiculosRes] = await Promise.all([
                getCitas(),
                getMecanicos(),
                getClientes(),
                getVehiculos()
            ]);

            setCitas(citasRes.data);
            setMecanicos(mecanicosRes.data);
            setClientes(clientesRes.data);
            setVehiculos(vehiculosRes.data);
        } catch (error) {
            setError('Error cargando datos');
        }
    };

    const mecanicosDisponibles = () => {
        if (!formData.fechaCita) return mecanicos;

        const citasEnFecha = citas.filter(cita => cita.fechaCita.split('T')[0] === formData.fechaCita);
        return mecanicos.filter(mec => {
            const count = citasEnFecha.filter(cita => cita.mecanicoId === mec._id).length;
            return count < 4; // Máximo 4 citas por día por mecánico
        });
    };

    const horasPermitidas = ["08:00", "10:00", "12:00", "14:00"];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.clienteId || !formData.vehiculoId || !formData.mecanicoId || !formData.fechaCita) {
            setError("Por favor completa todos los campos obligatorios.");
            return;
        }

        const cliente = clientes.find(c => c._id === formData.clienteId);
        const vehiculo = vehiculos.find(v => v._id === formData.vehiculoId);
        const mecanico = mecanicos.find(m => m._id === formData.mecanicoId);

        if (!cliente || !vehiculo || !mecanico) {
            setError("Datos inválidos seleccionados.");
            return;
        }

        const citaCompleta = {
            ...formData,
            clienteNombre: cliente.nombre,
            vehiculoPlaca: vehiculo.placa,
            mecanicoNombre: mecanico.nombre
        };

        try {
            await addCita(citaCompleta);
            setFormVisible(false);
            setError(null);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || "Error al guardar la cita");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Eliminar cita?")) {
            try {
                await deleteCita(id);
                fetchData();
            } catch {
                setError("Error al eliminar la cita");
            }
        }
    };

    return (
        <div className="contenedor">
            <h2>Citas</h2>
            <div className="btn-container">
                <button className="btn insertar" onClick={() => setFormVisible(true)}>Nueva Cita</button>
            </div>

            {error && <p className="error">{error}</p>}

            {formVisible && (
                <div className="modal">
                    <form className="formulario" onSubmit={handleSubmit}>
                        <label>Cliente</label>
                        <select
                            value={formData.clienteId}
                            onChange={e => setFormData({ ...formData, clienteId: e.target.value })}
                            required
                        >
                            <option value="">-- Seleccione cliente --</option>
                            {clientes.map(c => <option key={c._id} value={c._id}>{c.nombre}</option>)}
                        </select>

                        <label>Vehículo</label>
                        <select
                            value={formData.vehiculoId}
                            onChange={e => setFormData({ ...formData, vehiculoId: e.target.value })}
                            required
                        >
                            <option value="">-- Seleccione vehículo --</option>
                            {vehiculos.map(v => <option key={v._id} value={v._id}>{v.placa}</option>)}
                        </select>

                        <label>Mecánico</label>
                        <select
                            value={formData.mecanicoId}
                            onChange={e => setFormData({ ...formData, mecanicoId: e.target.value })}
                            required
                        >
                            <option value="">-- Seleccione mecánico disponible --</option>
                            {mecanicosDisponibles().map(m => <option key={m._id} value={m._id}>{m.nombre}</option>)}
                        </select>

                        <label>Fecha de cita</label>
                        <input
                            type="date"
                            value={formData.fechaCita}
                            onChange={e => setFormData({ ...formData, fechaCita: e.target.value })}
                            required
                        />

                        <label>Hora inicio</label>
                        <select
                            value={formData.horaInicio}
                            onChange={e => setFormData({ ...formData, horaInicio: e.target.value })}
                            required
                        >
                            {horasPermitidas.map(h => (
                                <option key={h} value={h}>{h}</option>
                            ))}
                        </select>

                        <label>Servicio</label>
                        <input
                            type="text"
                            placeholder="Descripción del servicio"
                            value={formData.servicio}
                            onChange={e => setFormData({ ...formData, servicio: e.target.value })}
                        />

                        <label>Observaciones</label>
                        <textarea
                            placeholder="Observaciones adicionales"
                            value={formData.observaciones}
                            onChange={e => setFormData({ ...formData, observaciones: e.target.value })}
                        ></textarea>

                        <div className="btn-container-modal">
                            <button type="submit" className="btn insertar">Guardar</button>
                            <button type="button" className="btn eliminar" onClick={() => setFormVisible(false)}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="cursos-grid">
                {citas.map(cita => (
                    <div key={cita._id} className="card">
                        <h3>{cita.servicio || "Cita"}</h3>
                        <p><strong>Cliente:</strong> {cita.clienteNombre || "No asignado"}</p>
                        <p><strong>Vehículo:</strong> {cita.vehiculoPlaca || "No asignado"}</p>
                        <p><strong>Mecánico:</strong> {cita.mecanicoNombre || "No asignado"}</p>
                        <p><strong>Fecha:</strong> {new Date(cita.fechaCita).toLocaleDateString()}</p>
                        <p><strong>Hora:</strong> {cita.horaInicio}</p>
                        <p><strong>Observaciones:</strong> {cita.observaciones || "Ninguna"}</p>
                        <div className="acciones">
                            <button className="btn eliminar" onClick={() => handleDelete(cita._id)}>Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Citas;
