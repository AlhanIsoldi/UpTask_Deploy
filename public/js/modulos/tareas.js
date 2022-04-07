import axios from 'axios'
import Swal from 'sweetalert2'

import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes')

if (tareas) {
  tareas.addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-check-circle')) {
      const icono = e.target
      
      //extraer id de tarea
      const idTarea = e.target.parentElement.parentElement.dataset.tarea
        
      //Request hacia /tareas/:id
      const url = `${location.origin}/tareas/${idTarea}`
        
      axios.patch(url, { idTarea }).then(function (respuesta) {
        if (respuesta.status === 200) {
          icono.classList.toggle('completo')

          actualizarAvance()
        }
      })
    }

    if (e.target.classList.contains('fa-trash')) {
      const tareaHTML = e.target.parentElement.parentElement,
        idTarea = tareaHTML.dataset.tarea

      Swal.fire({
        title: 'Deseas eliminar?',
        text: 'Esta acción no se puede deshacer!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Borrar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.value) {
          const url = `${location.origin}/tareas/${idTarea}`
          
          //Enviar el delete por axios
          axios.delete(url, { params: { idTarea } }).then(function (respuesta) {
            if (respuesta.status === 200) {

              //Eliminar el nodo de la lista
              tareaHTML.parentElement.removeChild(tareaHTML)

              //Alerta opcional
              Swal.fire(respuesta.data)

              actualizarAvance()
            }
          })
        }
      })
    }
  })
}


export default tareas
