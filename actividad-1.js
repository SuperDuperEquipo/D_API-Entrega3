const express = require('express');
const app = express();

app.use(express.json());

const Asignados = [
    "Susana Beltrán",
    "Debbie Cruz",
    "Andre Iraheta",
    "Tiffany Meléndez",
    "Dana Ochoa"
];

let tareas = [
    {
        id: 1,
        horaRegistro: new Date(),
        asignado: "Susana Beltrán",
        peso: 3,
        descripcion: "Crear un API REST con Express",
        titulo: "Entrega 3 APIs"
    }
];

// GET - Default
app.get('/', (req, res) => {
    res.json({ mensaje: 'API actividad-1 super duper funcionando' })
});

// GET - Obtener todas las tareas 
app.get('/tareas', (req, res) => {
    res.json(tareas);
});

// GET - Obtener una tarea por ID
app.get('/tareas/:id', (req, res) => {
    const tarea = tareas.find(t => t.id == req.params.id);

    if (!tarea) {
        return res.status(404).json({
            mensaje: "La tarea no ha sido encontrada"
        });
    }

    res.json(tarea);
});

// POST - Crear una nueva tarea
app.post('/tareas', (req, res) => {
    const { asignado, peso, titulo, descripcion } = req.body;

    if (!Asignados.includes(asignado)) {
        return res.status(400).json({
            mensaje: "El asignado no se encuentra en la lista de asignados válidos"
        });
    }

    if (peso < 1 || peso > 12) {
        return res.status(400).json({
            mensaje: "Error. El peso debe estar entre 1 y 12"
        });
    }

    const nuevaTarea = {
        id: Date.now(),
        horaRegistro: new Date(),
        asignado,
        peso,
        titulo,
        descripcion
    };

    tareas.push(nuevaTarea);
    res.status(201).json(nuevaTarea);
});

// POST - Agregar tareas en batch
app.post('/tareas/batch', (req, res) => {
    const tareasNuevas = req.body;

    if (!Array.isArray(tareasNuevas)) {
        return res.status(400).json({
            mensaje: "El cuerpo de la solicitud debe ser un arreglo de tareas"
        });
    }

    const tareasCreadas = [];

    for (const tarea of tareasNuevas) {
        const { asignado, peso, titulo, descripcion } = tarea;

        if (!Asignados.includes(asignado) || peso < 1 || peso > 12) {
            continue;
        }

        const nuevaTarea = {
            id: Date.now() + Math.random(),
            horaRegistro: new Date(),
            asignado,
            peso,
            titulo,
            descripcion
        };

        tareas.push(nuevaTarea);
        tareasCreadas.push(nuevaTarea);
    }

    res.status(201).json(tareasCreadas);
});

// DELETE - Eliminar tareas en batch
app.delete('/tareas/batch', (req, res) => {
    const ids = req.body;

    if (!Array.isArray(ids)) {
        return res.status(400).json({
            mensaje: "El cuerpo de la solicitud debe ser un arreglo de IDs"
        });
    }

    tareas = tareas.filter(t => !ids.includes(t.id));

    res.json({
        mensaje: "Tareas eliminadas exitosamente"
    });
});

// PUT - Actualizar una tarea existente
app.put('/tareas/:id', (req, res) => {
    const tarea = tareas.find(t => t.id == req.params.id);

    if (!tarea) {
        return res.status(404).json({
            mensaje: "La tarea no ha sido encontrada"
        });
    }

    const { asignado, peso, titulo, descripcion } = req.body;

    if (asignado && !Asignados.includes(asignado)) {
        return res.status(400).json({
            mensaje: "El asignado no se encuentra en la lista de asignados válidos"
        });
    }

    if (peso !== undefined && (peso < 1 || peso > 12)) {
        return res.status(400).json({
            mensaje: "Error. El peso debe estar entre 1 y 12"
        });
    }

    tarea.asignado = asignado || tarea.asignado;
    tarea.peso = peso !== undefined ? peso : tarea.peso;
    tarea.titulo = titulo || tarea.titulo;
    tarea.descripcion = descripcion || tarea.descripcion;

    res.json(tarea);
});

// DELETE - Eliminar una tarea por ID
app.delete('/tareas/:id', (req, res) => {

    let tareaIndex = tareas.findIndex(t => t.id == req.params.id);

    if (tareaIndex === -1) {  
        return res.status(404).json({
            mensaje: "La tarea no ha sido encontrada"
        });
    }

    tareas = tareas.filter(t => t.id != req.params.id); 

    res.json({
        mensaje: "Tarea eliminada exitosamente"
    });
});

app.listen(3000, () => {
    console.log('Servidor escuchando en puerto 3000 - http://localhost:3000');
});