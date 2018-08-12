// dependencias
const mongoose = require('mongoose');

// Schema
let Schema = mongoose.Schema;

// configurando Schema
let categoriaSchema = new Schema({
	descripcion: { 
		type: String, 
		unique: true, 
		required: [true, 'La descripción es obligatoria'] 
	},
 	usuario: { 
 		type: Schema.Types.ObjectId, 
 		ref: 'Usuario'
 	}
});

// exportanto el modelo
module.exports = mongoose.model( 'Categoria', categoriaSchema );