// dependencias
const jwt = require('jsonwebtoken');

// verificar token
let verificaToken = ( req, res, next ) => {

	let token = req.get('token');

	jwt.verify( token, process.env.SEED, (err, decoded) => {

		if( err ){
			return res.status(401).json({
				ok: false,
				message: 'token no válido'
			})
		}

		req.usuario = decoded.usuario;
		next();
	})	
}

let verificaAdminRole = ( req, res, next ) => {

	let usuario = req.usuario;

	if( usuario.role === "ADMIN_ROLE"){
		next();
	}
	else{
		return res.status(500).json({
			ok: false,
			message: 'No es usuario Administrador'
		})
	}
}

module.exports = { verificaToken, verificaAdminRole };