import Swal from 'sweetalert2'
import axios from 'axios'

const btnEliminar = document.querySelector('#eliminar-proyecto')

if (btnEliminar) {
  btnEliminar.addEventListener('click', (e) => {
    const urlProyecto = e.target.dataset.proyectoUrl
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
      if (result.isConfirmed) {
        //Enviar peticion axios
        const url = `${location.origin}/proyectos/${urlProyecto}`

        axios
          .delete(url, { params: { urlProyecto } })
          .then(function (respuesta) {
            console.log(respuesta)

            Swal.fire('Borrado!', respuesta.data , 'success')

            //Redireccionar al inicio
            setTimeout(() => {
              window.location.href = '/'
            }, 2000)
          })
            .catch(() => {
                 Swal.fire({
                    type: 'Error!',
                    title: 'Hubo un error',
                    text: 'No se pudo borrar el proyecto'
                 })   
            })
      }
    })
  })
}

export default btnEliminar
