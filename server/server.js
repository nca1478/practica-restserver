 // config
require('./config/config')

// dependencias
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// Habilitar carpeta public
app.use( express.static( path.resolve( __dirname, '../public' )));

// rutas
app.use(require('./routes/index'));

// conexion a la BD
mongoose.connect(process.env.URL_DB, { useNewUrlParser: true }, (err, res) => {

	if( err ) throw err;

	console.log('Base de Datos ONLINE');
});

// puerto de estucha servidor
app.listen(process.env.PORT,(req, res) =>{
	console.log(`Escuchando por el puerto ${process.env.PORT}`);
})