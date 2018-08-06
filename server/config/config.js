
// Puertos
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Base de datos
let urlDB;

if( process.env.NODE_ENV === 'dev' ){
	urlDB = 'mongodb://localhost:27017/cafe-pract';
}
else{
	urlDB = 'mongodb://cafe-user:14006016nca@ds113942.mlab.com:13942/cafe-pract';
}

process.env.URL_DB = urlDB;
