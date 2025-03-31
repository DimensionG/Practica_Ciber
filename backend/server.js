/*Declaramos las variables para poder, hacer una conexion con el servidor
o base de datos*/ 
const express = require('express')
const cookieParser = require('cookie-parser')
const csrf = require('csrf')
const dotenv = require('dotenv') //cargar las configuraciones
const crypto = require('crypto') //Criptografia
const cors = require('cors');

dotenv.config();

const port = process.env.PORT || 3000; //definimos el numero de puerto
const SECRET_KEY = process.env.SECRET_KEY || 'secret'; //Generar toquens RR

const users =[
  { username: 'admin', password: 'admin' }
  //Agregar más usuarios aquí...
];
const sessions = {}; //Diccionario Vacio donde se guardaran las sesiones activas

const secureCookieOptions = () => ({
  httpOnly: true,
  secure: true,
  sameSite:  'strict'
});

const app = express();
app.use(cookieParser()); //Usar Cookie Parser, Convertir obj de peticion y la respuesta de forma distinta enviarlos y recibir los datos
app.use(express.json());
app.use(express.urlencoded({ extended: true})); 
 app.use(cors({
   origin: 'http://localhost:3002',
   credentials: true
 }))

app.get('/', (req, res) => { // ruta raíz endpoint
    res.send('Hello World!'); //Donde se apunta al hello world 
  }); 

app.get('/csrf-token', (req, res) => { //Nuevo endpoint para generar un token valido de sesion activa.
    const csrfToken = csrf().create(SECRET_KEY); //Se define la variable y se encripta
    res.json({ csrfToken }); //Lo enviamos en json
});

app.post('/login', (req, res) => {
  const { username, password, csrfToken } = req.body; //Obtener los datos del login con el REQ
  
  if(!csrf().verify(SECRET_KEY, csrfToken)){ //Validamos si el token obtenido es valido
    return res.status(403).json({error: 'Invalid CSRF token'});
  }
  if(!username || !password){ //Validamos si ingresa password y username
    return res.status(400).json({error: 'Username and password are required'});
  }
  const user = users.find(user => user.username.toLowerCase() == username.toLowerCase()); //Buscamos si esta en la base el usuario
  if(!user || user.password !== password) { // verification if the user exists already
    return res.status(401).json({error: 'Usuario o constraseña incorrecta'});
  }
  const sessionId = crypto.randomBytes(16).toString('base64url'); //Generamos un sessionId aleatorio de tipo cadena y lo convierte en base64 visto en clase y se pone en la URL
  sessions[sessionId] = {username};
  res.cookie('sessionId', sessionId, secureCookieOptions());
  res.status(201).json({message: 'Login successfully'});
})
  
app.listen(port, () => { // arrancamos el servidor
      console.log(`Server listening at http://localhost:${port}`); //Muestra en consola el puerto en el que se conecta
  });
  //netstat -nao Ver el puertos usados 
  //taskkill /PID 15464 /F Matar servidor