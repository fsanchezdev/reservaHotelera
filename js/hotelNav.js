document.querySelectorAll('.dropdown-menu:last-child')[1].addEventListener('click', e => { e.stopPropagation() })

/* $(document).on('click', '.dropdown-menu', function (e) {
    e.stopPropagation();
}); */

// Carga  de los datos predefinidos
document.getElementById('hotel').placeholder = 'Destination, resort or hotel'
document.querySelector('[role="button"]').textContent = '7 Nights'
document.getElementById('room').textContent = '1 Room & 2 Guests'

// Input fecha con fecha mínima actual
const checkin = document.getElementById('checkin')
checkin.value = new Date().toISOString().slice(0, 10)
checkin.min = new Date().toISOString().slice(0, 10)

// Html de desplegable de noches // meter en onload?
let nodoNuevo
const popularNights = ['4', '7', '10', '14']
const maxNight = 14

let miNodo = document.getElementsByClassName('dropdown-menu')[0]
nodoNuevo = generarElemento('p', 'POPULAR DURATIONS', '', ['dropdown-item', 'disabled'])
miNodo.appendChild(nodoNuevo)

/* for (let i = 0; i < popularNights.length; i++) {
  nodoNuevo = generarElemento('a', popularNights[i] + ' Nights', '', ['dropdown-item'])
  nodoNuevo.setAttribute('href', '#')
  miNodo.appendChild(nodoNuevo)
  nodoNuevo.addEventListener('click', actualizarNoche)
} */

popularNights.map(noche => fillDropdown(noche))
/**
 * Genera el html de los las duraciones preferidas
 * @param {Number} noche
 */
function fillDropdown (noche) {
  nodoNuevo = generarElemento('a', noche + ' Nights', '', ['dropdown-item'])
  nodoNuevo.setAttribute('href', '#')
  miNodo.appendChild(nodoNuevo)
  nodoNuevo.addEventListener('click', actualizarNoche)
}

miNodo.appendChild(generarElemento('div', '', '', ['dropdown-divider']))
miNodo.appendChild(generarElemento('p', 'DAILY', '', ['dropdown-item', 'disabled']))
nodoNuevo.setAttribute('href', '#')
for (let i = 1; i <= maxNight; i++) {
  nodoNuevo = generarElemento('a', i + ' Nights', '', ['dropdown-item'])
  nodoNuevo.setAttribute('href', '#')
  miNodo.appendChild(nodoNuevo)
  nodoNuevo.addEventListener('click', actualizarNoche)
}

/**
 * Actualiza a la opcion elegida en el desplegable de noches
 */
function actualizarNoche () {
  document.querySelector('[role="button"]').textContent = this.textContent
}

// Html de desplegable de habitaciones
const prefAdult = 2
const maxAdults = 5; const maxChilds = 5; const maxChildAge = 17
miNodo = document.getElementsByTagName('select')[0]
for (let i = 1; i <= maxAdults; i++) {
  nodoNuevo = generarElemento('option', i)
  nodoNuevo.setAttribute('value', i)
  miNodo.appendChild(nodoNuevo)
}
miNodo.getElementsByTagName('option')[prefAdult - 1].setAttribute('selected', 'selected')

// Html de el select de cuantos ninios
miNodo = document.getElementsByTagName('select')[1]
for (let i = 0; i < maxChilds; i++) {
  nodoNuevo = generarElemento('option', i)
  nodoNuevo.setAttribute('value', i)
  miNodo.appendChild(nodoNuevo)
}
miNodo.addEventListener('change', () => { actDropEdad(0) })

/**
 * Genera o destruye los desplegables de las edades de los ninios
 * @param {Number} nRoom
 */
function actDropEdad (nRoom) {
  miNodo = document.getElementsByClassName('roomCard')[nRoom]

  const nodosHijosLength = miNodo.querySelectorAll('.ageRow select').length

  let diffNinios = miNodo.getElementsByTagName('select')[1].selectedOptions[0].value - nodosHijosLength
  if (diffNinios < 0) {
    diffNinios = Math.abs(diffNinios)
    for (let i = 0; i < diffNinios; i++) {
      miNodo.querySelector('.ageRow:last-child').removeChild(miNodo.querySelectorAll('.ageRow select')[miNodo.querySelectorAll('.ageRow select').length - 1])
      if (miNodo.querySelector('.ageRow:last-child').childNodes.length === 0) {
        miNodo.removeChild(miNodo.querySelector('.ageRow:last-child'))
      }
    }
    if (miNodo.querySelector('.ageRow') == null) {
      miNodo.removeChild(miNodo.querySelector('.infoChild'))
    }
  } else {
    if (miNodo.querySelector('.ageRow') == null) {
      miNodo.appendChild(generarElemento('div', 'CHILD AGES (AGE ON DATE OF RETURN)', '', ['infoChild']))
    }

    const nodoSelect = generarElemento('select')

    nodoSelect.appendChild(generarElemento('option', 'Age'))
    nodoSelect.firstChild.setAttribute('selected', 'selected')
    nodoSelect.firstChild.setAttribute('disabled', 'disabled')
    for (let i = 1; i <= maxChildAge; i++) {
      nodoNuevo = generarElemento('option', i)
      nodoNuevo.setAttribute('value', i)
      nodoSelect.appendChild(nodoNuevo)
    }

    for (let i = nodosHijosLength; i < nodosHijosLength + diffNinios; i++) {
      if (i % 2 === 0) {
        miNodo.appendChild(generarElemento('div', '', '', ['ageRow']))
      }
      miNodo.querySelector('div:last-child').appendChild(nodoSelect.cloneNode(true))
    }
  }
}
// la proxima vez le pones otra clase en plan creadorRooms, implementar? no, .roomCard:last-child>div:first-child no queda mal
document.querySelector('.roomCard:last-child>div:first-child').addEventListener('click', addRoom)

/**
 * Html para generar una nueva habitación mediante clonado
 */
function addRoom () {
  const nRoom = document.querySelectorAll('.roomCard:not(:last-child)').length
  const maxRooms = 4
  if (nRoom < maxRooms) {
    miNodo = document.querySelector('.roomCard').cloneNode(true)

    if (miNodo.getElementsByClassName('infoChild')[0] != null) {
      miNodo.removeChild(miNodo.getElementsByClassName('infoChild')[0])
    }
    while (miNodo.getElementsByClassName('ageRow').length !== 0) {
      miNodo.removeChild(miNodo.getElementsByClassName('ageRow')[0])
    }

    miNodo.getElementsByTagName('select')[1].addEventListener('change', () => { actDropEdad(nRoom) })
    document.querySelector('.roomsContainer').insertBefore(miNodo, document.getElementsByClassName('roomsContainer')[0].lastChild.previousSibling)

    miNodo = generarElemento('div', 'x', '', ['close'])
    miNodo.addEventListener('click', closeRoom)
    document.querySelector('.roomCard:last-child').previousSibling.appendChild(miNodo)

    document.querySelector('.roomCard:last-child').previousSibling.querySelector('div:first-child span').textContent = document.querySelectorAll('.roomCard:not(:last-child)').length
    // para que bootstrap actualize la posición de el desplegable quito y pongo
    document.getElementsByClassName('dropdown-toggle')[1].click()
    document.getElementsByClassName('dropdown-toggle')[1].click()
  }
}

/**
 * Elimina la habitacion seleccionada
 */
function closeRoom () {
  let selectedChildDeRoom
  miNodo = event.target.parentElement
  miNodo.parentElement.removeChild(miNodo)

  let contRooms = 0
  miNodo = document.querySelectorAll('.roomCard:not(:last-child)')

  for (let i = 0; i < miNodo.length; i++) {
    selectedChildDeRoom = miNodo[i].getElementsByTagName('select')[1].selectedIndex
    miNodo[i].children[0].getElementsByTagName('span')[0].textContent = contRooms + 1

    const nRoom = contRooms

    // no se quitar evento solo pq la funcion tiene parametros, ni aislandola fuera, solucion temp, quitar los select, montarlos con el valor anterior y poner eventos de nuevo
    // miNodo[i].getElementsByTagName('select')[1].removeEventListener('change', () => { actDropEdad(nRoom)})
    // miNodo[i].getElementsByTagName('select')[1].addEventListener('change', () => { actDropEdad(nRoom) })

    miNodo[i].querySelector('div:nth-child(3)').removeChild(miNodo[i].getElementsByTagName('select')[1])
    miNodo[i].querySelector('div:nth-child(3)').appendChild(generarElemento('select'))
    nodoNuevo = miNodo[i].getElementsByTagName('select')[1]
    for (let i = 0; i < maxChilds; i++) {
      const nodo = generarElemento('option', i)
      nodoNuevo.setAttribute('value', i)
      nodoNuevo.appendChild(nodo)
    }
    nodoNuevo.selectedIndex = selectedChildDeRoom
    // cuidado, error de yesica, si uso una variable como parametro para la función del evento cogerá el valor de la
    // variable que tenga al llamarla ya que guarda la referencia no el valor al establecer el evento, Solucion: tener una variable en el ambito que muera en cada uso (nRoom)
    nodoNuevo.addEventListener('change', () => { actDropEdad(nRoom) })

    contRooms++
  }
  document.getElementsByClassName('dropdown-toggle')[1].click()
  document.getElementsByClassName('dropdown-toggle')[1].click()
}

document.querySelector('.roomCard:last-child>p').addEventListener('click', actRoomsGuests)

/**
 * Actualiza segun las habitaciones y personas la cabecera
 */
function actRoomsGuests () {
  document.getElementById('room').textContent = document.getElementsByClassName('roomCard').length - 1 + ' Room/s & ' +
        Array.prototype.map.call(document.querySelectorAll('.roomCard:not(:last-child) div:nth-child(2) select,.roomCard:not(:last-child) div:nth-child(3) select')
          , node => parseInt(node.selectedOptions[0].value))
          .filter(num => num !== 0)
          .reduce((suma, num) => suma + num) + ' Guest/s'
  document.getElementsByClassName('dropdown-toggle')[1].click()
}

// IMPORTANTE este metodo sustituye al anterior y muestra las personas segun cada habitacion,
// como no se que pedias aqui tienes los 2, pd.d este destroza la estructura de la web visualmente
/**
 * Actualiza segun las habitaciones y personas la cabecera y pone las personas por habitacion
 */
/* function actRoomsGuests () {
  document.getElementById('room').textContent = ''
  const guestsForRoom = Array.prototype.map.call(document.querySelectorAll('.roomCard:not(:last-child'), node => node.querySelectorAll(' div:nth-child(2) > select, div:nth-child(3) > select')).map(q => parseInt(q[0].selectedOptions[0].value) + parseInt(q[1].selectedOptions[0].value))
  for (let i = 0; i < guestsForRoom.length; i++) {
    document.getElementById('room').textContent += `room ${i + 1}, ${guestsForRoom[i]} guest/s  `
  }
  document.getElementsByClassName('dropdown-toggle')[1].click()
} */

document.querySelector('[type="button"]').addEventListener('click', buscar)

/**
 * Muestra por consola la seleccion elegida
 */
function buscar () {
  if (document.getElementById('hotel').value !== '') {
    console.log(document.getElementById('hotel').value)
  } else {
    console.log('hotel no seleccionado')
  }
  console.log(document.getElementById('checkin').value)
  console.log(document.getElementById('nights').textContent)
  const guestsForRoom = Array.prototype.map.call(document.querySelectorAll('.roomCard:not(:last-child'), node => node.querySelectorAll(' div:nth-child(2) > select, div:nth-child(3) > select')).map(q => parseInt(q[0].selectedOptions[0].value) + parseInt(q[1].selectedOptions[0].value))
  for (let i = 0; i < guestsForRoom.length; i++) {
    console.log(`room ${i + 1}, ${guestsForRoom[i]} guest/s`)
  }
}

/**
 * Genera un elemento de html
 * @param {String} elemento
 * @param {String} text
 * @param {Number} id
 * @param {String[]} clases
 */
function generarElemento (elemento, text = '', id = '', clases = '') {
  const nodo = document.createElement(elemento)
  if (text !== '') {
    const texto = document.createTextNode(text)
    nodo.appendChild(texto)
  }
  if (clases !== '') {
    clases.forEach((item) => { nodo.classList.add(item) })
  }
  if (id !== '') { nodo.setAttribute('id', id) }
  return nodo
}

// https://stackoverflow.com/questions/25443347/show-bootstrap-select-inside-bootstrap-button-dropdown
