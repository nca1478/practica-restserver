// dependencias
const express = require('express');
const _ = require('underscore');
const app = express();

// modelos
const Producto = require('../models/producto');

// middlewares
const { verificaToken } 
= require('../middlewares/autenticacion');

// rutas
app.get('/producto', verificaToken, (req, res) => {
	
	let desde = Number(req.query.desde) || 0;
	let limite = Number(req.query.limite) || 5;

	Producto.find({ disponible: true })
	.sort('nombre')
	.populate('usuario', 'nombre')
	.populate('categoria', 'descripcion')
	.limit(limite)
	.skip(desde)
	.exec((err, productos) => {
		if( err ){
			return res.status(500).json({
				ok: false,
				err
			})
		}

		Producto.countDocuments({ disponible: true },(err, conteo) => {
			res.json({
				ok: true,
				productos,
				cantidad: conteo === 0 ? 'No hay productos disponibles' : conteo
			})
		})

	})
})

app.get('/producto/:id', verificaToken, (req, res) => {

	let id = req.params.id;

	Producto.findById(id)
	.populate('usuario', 'nombre')
	.populate('categoria', 'nombre')
	.exec((err, productoDB) => {

		if( err ){
			return res.status(500).json({
				ok: false,
				err
			})
		}

		if( !productoDB ){
			return res.status(400).json({
				ok: false,
				err: {
					message: 'Producto no existe'
				}
			})
		}
		
		res.json({
			ok: true,
			producto: productoDB
		})
	})
})

app.post('/producto', verificaToken, (req, res) => {

	let body = req.body;

	let producto = new Producto({
		usuario: req.usuario._id,
		nombre: body.nombre,
		precioUni: body.precioUni,
		descripcion: body.descripcion,
		disponible: body.disponible,
		categoria: body.categoria
	})

	producto.save((err, productoDB) => {

		if( err){
			return res.status(500).json({
				ok: false,
				err
			})
		} 	

		res.json({
			ok: true,
			producto: productoDB
		})

	})

})

app.put('/producto/:id', verificaToken, (req, res) => {
		
	let id = req.params.id;
	let body = _.pick(req.body, ['nombre','precioUni','categoria','disponible','descripcion']);

	Producto.findById(id, (err, productoDB) => {

		if( err ){
			return res.status(500).json({
				ok: false,
				err
			})
		}

		if( !productoDB ){
			return res.status(400).json({
				ok: false,
				err: {
					message: 'el producto no existe'
				}
			})
		}

		productoDB.nombre = body.nombre;
		productoDB.precioUni = body.precioUni;
		productoDB.categoria = body.categoria;
		productoDB.disponible = body.disponible;
		productoDB.descripcion = body.descripcion;

		productoDB.save((err, productoDB) => {

			if( err ){
				return res.status(500).json({
					ok: false,
					err
				})
			}	
			
			res.json({
				ok: true,
				producto: productoDB
			})		

		})
	})
})

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

	let termino = req.params.termino;
	let regex = new RegExp(termino, 'i');

	Producto.find({ nombre: regex })
	.populate('categoria', 'nombre')
	.exec((err, productos) => {

		if( err ){
			return res.status(500).json({
				ok: false,
				err
			})
		}	
		
		res.json({
			ok: true,
			producto: productos
		})
	
	})
})

app.delete('/producto/:id', verificaToken, (req, res) => {

	let id = req.params.id;
	let disponible = false;

	Producto.findByIdAndUpdate(id, { disponible }, { new: true }, (err, productoDB) => {

		if( err ){
			return res.status(500).json({
				ok: false,
				err
			})
		}

		if( !productoDB ){
			return res.status(400).json({
				ok: false,
				err: {
					message: 'el producto no existe'
				}
			})
		}

		res.json({
			ok: true,
			producto: productoDB
		})

	})

})

module.exports = app;
