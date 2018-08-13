// Dependencias
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const app = express();

// Modelos
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

	let tipo = req.params.tipo;
	let id = req.params.id;
	let tiposValidos = ['productos','usuarios'];

	// Validando ruta de la imagen (usuarios y productos)
	if(tiposValidos.indexOf(tipo) < 0){
		return res.status(500).json({
			ok: false,
			err: {
				message: 'Los tipos válidos son ' + tiposValidos.join(', ')
			}
		})
	}

	// Validando si fue seleccionado algún archivo
	if (!req.files){
    	return res.status(400).json({
    		ok: false,
    		err: {
    			message: 'No se ha seleccionado ningún archivo'
    		}
    	})
	}

	let archivo = req.files.archivo;
	let extensionesValidas = ['png','jpg','gif','jpeg'];
	let nombreArcCortado = archivo.name.split('.');
	let extension = nombreArcCortado[nombreArcCortado.length - 1];

	// Validando el tipo de extensión
	if(extensionesValidas.indexOf(extension) < 0){
		return res.status(400).json({
			ok: false,
			err: {
				message: 'Las extensiones válidas son ' + extensionesValidas.join(', ')
			}
		})
	}

	let nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extension}`
	
	// Copiando la imagen o foto en la carpeta destino (usuarios o productos)
	archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
	    if (err){
	    	return res.status(500).json({
	    		ok: false,
	    		err
	    	})
	    }

		if(tipo === 'usuarios'){
			imagenUsuario(id, res, nombreArchivo);
		}
		else{
			imagenProducto(id, res, nombreArchivo);
		}
	    
	});
});

function imagenUsuario(id, res, nombreArchivo){

	Usuario.findById(id, (err, usuarioDB) => {
		if ( err ){
			
			borraArchivo(nombreArchivo, 'usuarios');
			return res.status(500).json({
				ok: false,
				err
			})
		}

		if ( !usuarioDB ){

			borraArchivo(nombreArchivo, 'usuarios');
			return res.status(400).json({
				ok: false,
				err: {
					message: 'Usuario no encontrado'
				}
			})
		}

		borraArchivo(usuarioDB.img, 'usuarios');

		usuarioDB.img = nombreArchivo;

		usuarioDB.save((err, usuario) => {
			res.json({
				ok: true,
				usuario,
				img: nombreArchivo
			})
		})

	})
}

function imagenProducto(id, res, nombreArchivo){

	Producto.findById(id, (err, productoDB) => {
		if ( err ){
			
			borraArchivo(nombreArchivo, 'productos');
			return res.status(500).json({
				ok: false,
				err
			})
		}

		if ( !productoDB ){

			borraArchivo(nombreArchivo, 'productos');
			return res.status(400).json({
				ok: false,
				err: {
					message: 'Producto no encontrado'
				}
			})
		}

		borraArchivo(productoDB.img, 'productos');

		productoDB.img = nombreArchivo;

		productoDB.save((err, producto) => {
			res.json({
				ok: true,
				producto,
				img: nombreArchivo
			})
		})

	})
}

function borraArchivo(nombreImagen, tipo){

	let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`)

	if( fs.existsSync(pathImagen)){
		fs.unlinkSync(pathImagen);
	}

}

module.exports = app;