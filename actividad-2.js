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
    const pagina = Numer(paginas);
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


