const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');


// autenticar el usuario
exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/', 
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios',
});

//Funcion para revisar si el usuario esta autenticado
exports.usuarioAutenticado = (req, res, next) => {
    //Sie el usuario esta autenticado continua con la siguiente funcion
    if (req.isAuthenticated()) {
        return next();
    }

    //Si el usuario no esta autenticado redirige a la pagina de iniciar sesion
    return res.redirect('/iniciar-sesion');
}

//Funcion para cerrar sesion
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');//redirige a la pagina de iniciar sesion
    })
}

//Genera el token de autenticacion
exports.enviarToken = async (req, res) => {
    //Verifica si el usuario existe
    const { email } = req.body;
    const usuario = await Usuarios.findOne({ where: { email: req.body.email } });

    //Si el usuario no existe
    if (!usuario) {
        req.flash('error', 'No existe ese usuario');
        res.redirect('/reestablecer');
    }
    //Si el usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 360000;
    
    //Guarda el token en la base de datos
    await usuario.save()

    //Url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    //Envia el email con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password reset',
        resetUrl,
        archivo: 'reestablecer-password'
    })

    //Mensaje de exito
    req.flash('exito', 'Se envio un enlace a tu correo');
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({ where: { token: req.params.token } });
    //console.log(usuario);
    
    //Si el token no existe
    if (!usuario) {
        req.flash('error', 'Token invalido o expirado');
        res.redirect('/reestablecer');
    }

    //Formulario para generar el nuevo password
    res.render('resetPassword', {
        nombrePagina: 'Resetear contraseña'
    })
}

//Actualiza el password
exports.actualizarPassword = async (req, res) => {
    //Verifica el token que sea valido y la fecha de expiracion
    const usuario = await Usuarios.findOne({ 
        where: { 
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        } 
    });
    //Verificar si el usuario existe
    if (!usuario) {
        req.flash('error', 'Token invalido o expirado');
        res.redirect('/reestablecer');
    }

    //Hashea el password
    usuario.token = null;
    usuario.expiracion = null;
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    //Guarda el password en la base de datos
    await usuario.save();

    req.flash('exito', 'Contraseña actualizada correctamente');
    res.redirect('/iniciar-sesion');
}



