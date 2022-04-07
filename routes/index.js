const express = require('express')
const router = express.Router()

//Importar express validator
const { body } = require('express-validator')

//Importar controlador
const proyectosController = require('../controllers/proyectosControllers')
const tareasControllers = require('../controllers/tareasControllers')
const usuariosController = require('../controllers/usuariosControllers')
const authController = require('../controllers/authControllers')

module.exports = function () {
  //Ruta para el home
  router.get(
    '/',
    authController.usuarioAutenticado,
    proyectosController.proyectosHome
  )

  router.get(
    '/nuevo-proyecto',
    authController.usuarioAutenticado,
    proyectosController.formularioProyecto
  )

  router.post(
    '/nuevo-proyecto',
    body('nombre').not().isEmpty().trim().escape(),
    authController.usuarioAutenticado,
    proyectosController.nuevoProyecto
  )

  //Listar proyecto
  router.get(
    '/proyectos/:url',
    authController.usuarioAutenticado,
    proyectosController.proyectoPorUrl
  )

  //Actualizar proyecto
  router.get(
    '/proyecto/editar/:id',
    authController.usuarioAutenticado,
    proyectosController.formularioEditar
  )

  router.post(
    '/nuevo-proyecto/:id',
    body('nombre').not().isEmpty().trim().escape(),
    authController.usuarioAutenticado,
    proyectosController.actualizarProyecto
  )

  //Eliminar proyecto
  router.delete(
    '/proyectos/:url',
    authController.usuarioAutenticado,
    proyectosController.eliminarProyecto
  )

  //Actualizar estado de tarea
  router.post(
    '/proyectos/:url',
    authController.usuarioAutenticado,
    tareasControllers.agregarTarea
  )

  //Actualizar tarea
  router.patch(
    '/tareas/:id',
    authController.usuarioAutenticado,
    tareasControllers.cambiarEstadoTarea
  )

  //Eliminar tarea
  router.delete(
    '/tareas/:id',
    authController.usuarioAutenticado,
    tareasControllers.eliminarTarea
  )

  //Crear nueva cuenta
  router.get('/crear-cuenta', usuariosController.formCrearCuenta)
  router.post('/crear-cuenta', usuariosController.crearCuenta)
  router.get('/confirmar/:correo', usuariosController.confirmarCuenta)

  //Iniciar sesion
  router.get('/iniciar-sesion', usuariosController.formIniciarSesion)
  router.post('/iniciar-sesion', authController.autenticarUsuario)

  //Cerrar sesion
  router.get('/cerrar-sesion', authController.cerrarSesion)

  //Ruta para recuperar contraseña
  router.get('/reestablecer', usuariosController.formReestablecerPassword)
  router.post('/reestablecer', authController.enviarToken)
  router.get('/reestablecer/:token', authController.validarToken)
  router.post('/reestablecer/:token', authController.actualizarPassword)
  

  return router
}


