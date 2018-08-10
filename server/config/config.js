
// Puertos
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Base de datos
let urlDB;

// Fecha de expiracion del token
process.env.CADUCIDAD_TOKEN = process.env.CADUCIDAD_TOKEN || '24h';

// Semilla de autenticacion del token
process.env.SEED = process.env.SEED || 'pepe-trueno';

if( process.env.NODE_ENV === 'dev' ){
	urlDB = 'mongodb://localhost:27017/cafe-pract';
}
else{
	urlDB = process.env.MONGO_URI;
}
process.env.URL_DB = urlDB;

// Google Client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '921717354975-2o4gg46ugdrrlurjegl18dsgq9u3p61l.apps.googleusercontent.com';
