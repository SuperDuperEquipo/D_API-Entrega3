const express = require('express');
const app = express();

app.use(express.json());

// GET - Default
app.get('/', (req, res) => {
    res.json({ mensaje: 'API actividad-3 super duper funcionando' })
});

app.listen(3002, () => {
    console.log('Servidor escuchando en puerto 3002 - http://localhost:3002')
});