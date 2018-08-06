// dependencias
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongooseHidden = require('mongoose-hidden')();

// validacion de roles
let rolesValidos = {
	values: ['ADMIN_ROLE', 'USER_ROLE'],
	message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
	nombre: {
		type: String,
		required: [ true, 'el nombre es necesario']
	},
	email: {
		type: String,
		unique: true,
		required: [ true, 'el correo es necesario']
	},
	password: {
		type: String,
		required: [ true, 'la contrasena es obligatoria']
	},
	img: {
		type: String,
		required: false
	},
	role: {
		type: String,
		default: 'USER_ROLE',
		enum: rolesValidos
	},
	estado: {
		type: Boolean,
		default: true
	},
	google: {
		type: Boolean,
		default: false
	}
});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });
usuarioSchema.plugin(mongooseHidden, { 
	hidden: { _id: false, password: true },
});

module.exports = mongoose.model('Usuario', usuarioSchema);