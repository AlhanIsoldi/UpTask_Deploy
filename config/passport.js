const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

//Referencia al modelo donde se hara la autenticacion
const Usuarios = require('../models/Usuarios')

//LocalStrategy - login con credenciales propias (email y password)
passport.use(

  new LocalStrategy(
    //Por defaul passport toma por default el usuario y password
    {
      usernameField: 'email',
      passwordField: 'password',
    },

    async (email, password, done) => {
      try {

        const usuario = await Usuarios.findOne({
          where: { 
            email,
            activo: 1
           }
        })

        //El usuario existe password incorrecto
        if (!usuario.verificarPassword(password)) {
          return done(null, false, {
            message : 'Contraseña incorrecta',
          })
        }

        //El usuario existe password correcto
        return done(null, usuario)

      } catch (error) {

        //El usuario no existe
        return done(null, false, {
          message: 'El usuario no existe'
        })
      }
    }
  )
)

//Serializar el usuario
passport.serializeUser((usuario, callback) => {
  callback(null, usuario)
})

//Deserializar el usuario
passport.deserializeUser((usuario, callback) => {
  callback(null, usuario)
})

//Exportar el modulo
module.exports = passport
