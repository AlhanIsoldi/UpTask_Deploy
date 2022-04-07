export const actualizarAvance = () => {
  //Seleccionar tareas existentes
  const tareas = document.querySelectorAll('li.tarea')

  if (tareas.length) {
    //Seleccionar tareas completadas
    const tareasCompletas = document.querySelectorAll('i.completo')
    //Cacular el avance
    const avance = Math.round((tareasCompletas.length / tareas.length) * 100)
    //Mostrar el avance
    const porcentaje = document.querySelector('#porcentaje')
    porcentaje.style.width = avance+'%'
  }
}
