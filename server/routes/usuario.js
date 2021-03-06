// dependencias
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();

// modelos
const Usuario = require('../models/usuario');

// middlewares
const { verificaToken, 
		verificaAdminRole } 
= require('../middlewares/autenticacion');

// rutas
// app.get('/', verificaToken, (req, res) => {
// 	res.send('Para ver usuarios, ingrese /usuario');
// })

app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {
	let body = req.body;

	let usuario = new Usuario({
		nombre: body.nombre,
		email: body.email,
		password: bcrypt.hashSync(body.password, 10),
		role: body.role
	})

	usuario.save( (err,usuarioDB) => {

		if( err){
			return res.status(500).json({
				ok: false,
				err
			})
		} 	

		res.json({
			ok: true,
			usuario: usuarioDB
		})

	})

})

app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
	
	let id = req.params.id;
	let body = _.pick(req.body, ['nombre','email','img','role','estado'])

	Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

		if( err ){
			return res.status(500).json({
				ok: false,
				err
			})
		}

		if( !usuarioDB ){
			return res.status(400).json({
				ok: false,
				err: {
					message: 'el usuario no existe'
				}
			})
		}

		res.json({
			ok: true,
			usurio: usuarioDB
		})

	})
	
})

app.get('/usuario', verificaToken, (req, res) => {

	let desde = Number(req.query.desde) || 0;
	let limite = Number(req.query.limite) || 5;
	
	Usuario.find({ estado: true }, 'nombre email img role estado google')
	.skip(desde)
	.limit(limite)
	.exec( (err, usuarios) => {
		if( err ){
			return res.status(500).json({
				ok: false,
				err
			})
		}

		Usuario.countDocuments({ estado: true }, (err, conteo) => {
			res.json({
				ok: true,
				usuarios,
				cuantos: conteo
			})
		})

	})
})

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
	
	let id = req.params.id;
	let estado = false;

	Usuario.findByIdAndUpdate(id, { estado }, { new: true }, (err, usuarioDB) => {

		if( err ){
			return res.status(500).json({
				ok: false,
				err
			})
		}

		if( !usuarioDB ){
			return res.status(400).json({
				ok: false,
				err: {
					message: 'el usuario no existe'
				}
			})
		}

		res.json({
			ok: true,
			usuario: usuarioDB
		})

	})
	
})

module.exports = app;