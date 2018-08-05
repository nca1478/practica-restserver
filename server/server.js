// config
require('./config/config')

// dependencias
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.send('peticion GET');
})

app.post('/', (req, res) => {
	let body = req.body;

	if(body.nombre === undefined){
		return res.status(400).json({
			ok: false,
			message: 'el nombre es necesario'
		})
	}

	res.json({
		persona: body
	})
})

app.put('/', (req, res) => {
	res.send('peticion PUT');
})

app.delete('/', (req, res) => {
	res.send('peticion DELETE');
})

app.listen(process.env.PORT,(req, res) =>{
	console.log(`Escuchando por el puerto ${process.env.PORT}`);
})