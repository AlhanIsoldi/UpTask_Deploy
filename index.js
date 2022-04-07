const express = require('express')
const routes = require('./routes')
const path = require('path')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('./config/passport')

require('dotenv').config({ path: 'variables.env' })

//Helpers con algunas funciones
const helpers = require('./helpers')

//Crear conexion con DB
const db = require('./config/db')
const { cookie } = require('express/lib/response')


//Importar el modelo
require('./models/Proyectos')
require('./models/Tareas')
require('./models/Usuarios')

db.sync()
  .then(() => console.log('Conectado al servidor'))
  .catch((error) => console.log(error))

//Crear una app de express
const app = express()

//Cargar los archivos estaticos
app.use(express.static('public'))

//Habilitar Pug
app.set('view engine', 'pug')

//Habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({ extended: true }))

//Agregar express-validator
//app.use(expressValidator())

//Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'))

//Habilitar flash messages
app.use(flash())

app.use(cookieParser())

//Sesiones permite navegar entre paginas sin tener que autenticar
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
  })
)

app.use(passport.initialize())
app.use(passport.session())

//Pasar var dump a la aplicacion
app.use((req, res, next) => {
  
  res.locals.vardump = helpers.vardump
  res.locals.mensajes = req.flash()
  res.locals.usuario = {...req.user} || null
  next()
})

app.use('/', routes())

require('./handlers/email.js')

//Servidor y puerto
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

app.listen(port, host, () => {
  console.log(`Servidor corriendo en http://${host}:${port}`)
})

