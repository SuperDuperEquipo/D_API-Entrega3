const express = require('express');
const app = express();

app.use(express.json());

const Asignados = [
    { 
        id: 1, 
        nombre: "Susana Beltrán",   
        email: "susana@mail.com" 
    },
    { 
        id: 2, 
        nombre: "Debbie Cruz",       
        email: "debbie@mail.com" 
    },
    { 
        id: 3, 
        nombre: "Andre Iraheta",     
        email: "andre@mail.com" 
    },
    { 
        id: 4, 
        nombre: "Tiffany Meléndez",  
        email: "tiffany@mail.com" 
    },
    { 
        id: 5, 
        nombre: "Dana Ochoa",        
        email: "dana@mail.com" 
    }
];

const TRANSICIONES_VALIDAS = {
    'pendiente': ['en progreso'],
    'en progreso': ['bloqueada', 'completada'],
    'bloqueada': ['en progreso'],
    'completada': [],
};

let tareas = [
    {
        id: 1,
        horaRegistro: new Date(),
        asignado: Asignados[0],
        peso: 3,
        descripcion: "Crear un API rest con Express",
        titulo: "Entrega 3 APIs",
        estado: "pendiente"
    }
]

let auditoria = []

// GET - Default
app.get('/', (req, res) => {
    res.json({ mensaje: 'API actividad-3 super duper funcionando' })
});

// GET v1 - Tareas cons asignado como string
app.get('/v1/tareas', (req, res) => {
    const tareasV1 = tareas.map(t => ({
        ...t,
        asignado: t.asignado.nombre
    }));

    res.json(tareasV1);
});

// GET v2 = Tareas con asignado como objeto
app.get('/v2/tareas', (req, res) => {
    res.json(tareas);
});

// GET - Busqueda full-text
app.get('/tareas/buscar', (req, res) => {
    
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ mensaje: 'no hay termino para busqueda'})
    }

    const termino = q.toLowerCase();

    const resultados = tareas.filter(t =>
        t.descripcion.toLowerCase().includes(termino) ||
        t.asignado.nombre.toLowerCase().includes(termino)
    );

    res.json(resultados);
});

// GET - Historial de cambios de una tarea
app.get('/tareas/:id/historial', (req, res) => {
    const tarea = tareas.find(t => t.id == req.params.id);

    if (!tarea) {
        return res.status(404).json({ mensaje: 'No se encontró la tarea' });
    }

    const historial = auditoria.filter(a => a.tareaId == req.params.id);

    res.json(historial);
});

// POST - Transicion de estado de una tarea
app.post('/tareas/:id/transicion', (req, res) => {

    const tarea = tareas.find(t => t.id == req.params.id);

    if (!tarea)
    {
        return res.status(404).json({ mensaje: 'No se encontró la tarea' });
    }

    const { nuevoEstado } = req.body;

    if (!nuevoEstado) {
        return res.status(400).json({ mensaje: 'Debe enviar nuevo estado' });
    }

    const transicionesPermitidas = TRANSICIONES_VALIDAS[tarea.estado];

    if (!transicionesPermitidas.includes(nuevoEstado)) {
        return res.status(400).json({
            mensaje: `Transición inválida: no se puede pasar de '${tarea.estado}' a '${nuevoEstado}'`,
            transicionesPermitidas
        })
    }

    auditoria.push({
        tareaId: tarea.id,
        campo: 'estado',
        valorAnterior: tarea.estado,
        valorNuevo: nuevoEstado,
        fecha: new Date()
    });

    tarea.estado = nuevoEstado;

    res.json(tarea);

});

app.listen(3002, () => {
    console.log('Servidor escuchando en puerto 3002 - http://localhost:3002')
});