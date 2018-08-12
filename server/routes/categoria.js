// dependencias
const express = require('express');
const _ = require('underscore');
const app = express();

// modelos
const Categoria = require('../models/categoria');

// middlewares
const { verificaToken, 
		verificaAdminRole } 
= require('../middlewares/autenticacion');

app.post('/categoria', verificaToken, (req, res) => {
	let body = req.body;

	let categoria = new Categoria({
		descripcion: body.descripcion,
		usuario: req.usuario._id
	})

	categoria.save( (err,categoriaDB) => {

		if( err){
			return res.status(500).json({
				ok: false,
				err
			})
		} 	

		res.json({
			ok: true,
			categoria: categoriaDB
		})

	})

})

app.get('/categoria', verificaToken, (req, res) => {

	Categoria.find()
	.sort('descripcion')
	.populate('usuario')
	.exec( (err, categorias) => {
		if( err ){
			return res.status(500).json({
				ok: false,
				err
			})
		}

		Categoria.countDocuments((err, conteo) => {
			res.json({
				ok: true,
				categorias,
				cuantos: conteo
			})
		})

	})
})

app.get('/categoria/:id', verificaToken, (req, res) => {

	let id = req.params.id;

	Categoria.findById(id, (err, categoriaDB) => {

		if( err ){
			return res.status(500).json({
				ok: false,
				err
			})
		}

		if( !categoriaDB ){
			return res.status(400).json({
				ok: false,
				err: {
					message: 'Categoría no existe'
				}
			})
		}

		res.json({
			ok: true,
			categoria: categoriaDB
		})

	})
})

app.put('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
	
	let id = req.params.id;
	let body = _.pick(req.body, ['descripcion'])

	Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {

		if( err ){
			return res.status(500).json({
				ok: false,
				err
			})
		}

		if( !categoriaDB ){
			return res.status(400).json({
				ok: false,
				err: {
					message: 'Categoría no existe'
				}
			})
		}

		res.json({
			ok: true,
			categoria: categoriaDB
		})

	})
	
})

app.delete('/categoria/:id', [ verificaToken, verificaAdminRole ], (req, res) => {

	let id = req.params.id;

	Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

		if( err ){
			return res.status(500).json({
				ok: false,
				err
			})
		}

		if( !categoriaDB ){
			return res.status(400).json({
				ok: false,
				err: {
					message: 'Categoría no encontrada'
				}
			})
		}

		res.json({
			ok: true,
			categoria: categoriaDB,
			message: 'Categoría eliminada exitosamente'
		})

	})

})

module.exports = app;
