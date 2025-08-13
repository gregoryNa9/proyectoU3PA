const Cita = require("../models/mecanica");

exports.getAllCitas = async (req, res) => {
    try {
        const citas = await Cita.find()
            .populate("vehiculoId", "placa modelo")
            .populate("mecanicoId", "nombre especialidad")
            .populate("clienteId", "nombre telefono email");
        res.json(citas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener citas", error });
    }
};

exports.createCita = async (req, res) => {
    try {
        const { mecanicoId, fechaCita, horaInicio, duracionHoras } = req.body;

        const ahora = new Date();
        const fechaCitaDate = new Date(fechaCita);
        fechaCitaDate.setHours(0, 0, 0, 0);

        // Validar que la fecha no sea anterior al día actual
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (fechaCitaDate < hoy) {
            return res.status(400).json({ message: "La fecha de la cita no puede ser anterior a hoy." });
        }

        // Validar máximo 4 citas por mecánico por día (igual que antes)
        const fechaInicioDia = new Date(fechaCita);
        fechaInicioDia.setHours(0, 0, 0, 0);
        const fechaFinDia = new Date(fechaCita);
        fechaFinDia.setHours(23, 59, 59, 999);

        const citasDia = await Cita.countDocuments({
            mecanicoId,
            fechaCita: { $gte: fechaInicioDia, $lte: fechaFinDia }
        });

        if (citasDia >= 4) {
            return res.status(400).json({
                message: "El mecánico ya tiene 4 citas para ese día. No se pueden agendar más."
            });
        }

        // Validar que el horario no se solape con otra cita para el mismo mecánico
        // Calculamos rangos horarios en minutos para facilitar la comparación
        function horaAMinutos(horaStr) {
            const [h, m] = horaStr.split(":").map(Number);
            return h * 60 + m;
        }

        const nuevaHoraInicio = horaAMinutos(horaInicio);
        const nuevaHoraFin = nuevaHoraInicio + duracionHoras * 60;

        // Buscar citas existentes del mecánico en la misma fecha que se solapen
        const citasSolapadas = await Cita.find({
            mecanicoId,
            fechaCita: { $gte: fechaInicioDia, $lte: fechaFinDia }
        });

        for (const cita of citasSolapadas) {
            const existenteInicio = horaAMinutos(cita.horaInicio);
            const existenteFin = existenteInicio + (cita.duracionHoras || 2) * 60;

            // Comprobar si hay solapamiento
            const solapan = nuevaHoraInicio < existenteFin && nuevaHoraFin > existenteInicio;
            if (solapan) {
                return res.status(400).json({
                    message: `La cita se solapa con otra cita programada de ${cita.horaInicio} a ${existenteFin / 60}:00.`
                });
            }
        }

        // Todo bien, crear cita
        const cita = new Cita(req.body);
        await cita.save();

        res.status(201).json({ message: "Cita creada", cita });
    } catch (error) {
        res.status(400).json({ message: "Error al crear cita", error });
    }
};

exports.updateCita = async (req, res) => {
    try {
        await Cita.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: "Cita actualizada" });
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar cita", error });
    }
};

exports.deleteCita = async (req, res) => {
    try {
        await Cita.findByIdAndDelete(req.params.id);
        res.json({ message: "Cita eliminada" });
    } catch (error) {
        res.status(400).json({ message: "Error al eliminar cita", error });
    }
};
