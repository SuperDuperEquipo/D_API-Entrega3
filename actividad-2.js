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

let comentarios = [];
let reasignaciones = [];

function paginarResultados(elementos, paginas = 1, limit = 10) {

    const pagina = Number(paginas);
    const limite = Number(limit);

    if(!Number.isInteger(pagina) || pagina < 1) {
        return {
            error: "El número de página debe  ser mayor o igual a 1"
        };
    }
    const total = elementos.length;
    const totalPaginas = Math.ceil(total / limite);
    const inicio = (pagina - 1) * limite;
    const fin = inicio + limite;

    return {
        datos: elementos.slice(inicio, fin),
        paginacion: {
            pagina,
            total,
            totalPaginas, 
            limite,
            resultados: pagina < totalPaginas
        }
    };
}

// POST - Crear un comentario en una tarea
app.post('/tareas/:tareaId/comentarios', (req, res) => {

    const tarea = tareas.find(t => t.id == req.params.tareaId);

    if (!tarea)
    {
        return res.status(404).json({ mensaje: 'No se encontró la tarea' });
    }

    const { autor, texto } = req.body;

    const nuevoComentario = {
        id: Date.now(),
        tareaId: tarea.id,
        autor,
        texto,
        fecha: new Date()
    };

    comentarios.push(nuevoComentario);
    res.status(201).json(nuevoComentario);
});

// POST - Reasignar una tarea
app.post('/tareas/:id/reasignar', (req, res) => {

    const tarea = tareas.find(t => t.id == req.params.id);

    if (!tarea)
    {
        return res.status(404).json({ mensaje: 'No se encontró la tarea' });
    }

    const { nuevoAsignado } = req.body;

    if (!Asignados.includes(nuevoAsignado)) {
        return res.status(400).json({ mensaje: 'El asignado no está en la lista de asignados válidos' });
    }

    const resgistro = {
        tareaId: tarea.id,
        asignadoAnterior: tarea.asignado,
        nuevoAsignado,
        fecha: new Date()
    };

    reasignaciones.push(resgistro);
    tarea.asignado = nuevoAsignado;

    res.json(tarea);
});


// GET - Obtener tareas con filtros, orde y paginacion
app.get('/tareas', (req, res) => {

    const { asignado, peso, desde, hasta, orden, pagina, limit } = req.query;

    let resultado = [...tareas];

    if (asignado) {
        resultado = resultado.filter(t => t.asignado === asignado);
    }

    if (peso) {
        resultado = resultado.filter(t => t.peso === Number(peso));
    }

    if (desde) {
        resultado = resultado.filter(t => new Date(t.horaRegistro) >= new Date(desde));
    }

    if (hasta) {
        resultado = resultado.filter(t => new Date(t.horaRegistro) <= new Date(hasta));
    }

    if (orden === 'peso') {
        resultado.sort((a, b) => a.peso - b.peso);
    }

    if (orden === 'fecha') {
        resultado.sort((a, b) => new Date(a.horaRegistro) - new Date(b.horaRegistro));
    }

    const paginado = paginarResultados(resultado, pagina, limit);

    if (paginado.error) {
        return res.status(400).json({ mensaje: paginado.error });
    }

    res.json(paginado);
});

// GET - Obtener comentarios de una tarea 
app.get('/tareas/:tareaId/comentarios', (req, res) => {

    const tarea = tareas.find(t => t.id == req.params.tareaId);

    if (!tarea)
    {
        return res.status(404).json({ mensaje: 'No se encontró la tarea' });
    }

    const comentariosDeTarea = comentarios.filter(c => c.tareaId == req.params.tareaId);

    res.json(comentariosDeTarea);
});

// PUT - Actualizar comentarios
app.put('/tareas/:tareaId/comentarios/:comentarioId', (req, res) => {

    const tarea = tareas.find(t => t.id == req.params.tareaId);
    
    if (!tarea)
    {
        return res.status(404).json({ mensaje: 'No se encontró la tarea' });
    }

    const comentario = comentarios.find(c => c.id == req.params.comentarioId && c.tareaId == req.params.tareaId);

    if (!comentario)
    {
        return res.status(404).json({ mensaje: 'No se encontró el comentario' });
    }

    const { autor, texto } = req.body;

    comentario.autor = autor || comentario.autor;
    comentario.texto = texto || comentario.texto;

    res.json(comentario);
});

// DELETE - Eliminar un comentario
app.delete('/tareas/:tareaId/comentarios/:comentarioId', (req, res) => {
    
    const tarea = tareas.find(t => t.id == req.params.tareaId);
    
    if (!tarea)
    {
        return res.status(404).json({ mensaje: 'No se encontró la tarea' });
    }

    const comentario = comentarios.find(c => c.id == req.params.comentarioId && c.tareaId == req.params.tareaId);

    if (!comentario)
    {
        return res.status(404).json({ mensaje: 'No se encontró el comentario' });
    }

    comentarios = comentarios.filter(c => c.id != req.params.comentarioId);

    res.json({ mensaje: 'Comentario eliminado' });
});

app.listen(3001, () => {
    console.log('Servidor escuchando en puerto 3001 - http://localhost:3001')
});