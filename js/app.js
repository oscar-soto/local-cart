//---------------------- Variables
const carrito = document.querySelector('#carrito');
const contendorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
const countSpan = document.querySelector('.count');
const fragment = document.createDocumentFragment();
let articulosCarrito = [];

cargarEventListeners();
function cargarEventListeners() {
  // Cuando agregas un curso presionando "Agregar al carrito"
  listaCursos.addEventListener('click', agregarCurso);

  // Elimina curso del carrito
  carrito.addEventListener('click', eliminarCurso);

  // Vaciar el carrito
  vaciarCarritoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    articulosCarrito = []; // Resetemos el arreglo

    limpiarHTML(); // Eliminamos todo el HTML
  });

  // Muestra los cursos del Local Storage
  document.addEventListener('DOMContentLoaded', () => {
    articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

    carritoHTML();
  });
}

//---------------------- Funciones
function agregarCurso(e) {
  e.preventDefault();
  if (e.target.classList.contains('agregar-carrito')) {
    const cursoSeleccionado = e.target.parentElement.parentElement;
    leerDatosCurso(cursoSeleccionado);
  }
}

// Elimina un curso
function eliminarCurso(e) {
  if (e.target.classList.contains('borrar-curso')) {
    const cursoId = e.target.getAttribute('data-id');

    // Elimina del arreglo de articulosCarrito por el data-id
    articulosCarrito = articulosCarrito.filter((curso) => curso.id !== cursoId);
    carritoHTML();
  }
}

// Lee el contendio del HTML al que le dimos click  y extrae la informacion del curso
function leerDatosCurso(curso) {
  // Crear un objecto con el contendio del curso actual
  const infoCurso = {
    imagen: curso.querySelector('img').src,
    titulo: curso.querySelector('h4').textContent,
    precio: curso.querySelector('.precio span').textContent,
    id: curso.querySelector('a').getAttribute('data-id'),
    cantidad: 1,
  };

  // Revisa si un elemento ya existe en el carrito
  const existe = articulosCarrito.some((curso) => curso.id === infoCurso.id);
  if (existe) {
    // Actualizamos la cantidad
    const cursos = articulosCarrito.map((curso) => {
      if (curso.id === infoCurso.id) {
        curso.cantidad++;
        return curso; // Retorna el objeto actualizado
      } else {
        return curso; // Retorna los objectos que no son duplicados
      }
    });
    articulosCarrito = [...cursos];
  } else {
    // Agregamos el curso al carrito
    articulosCarrito = [...articulosCarrito, infoCurso];
  }

  carritoHTML();
}

// Muestra el carrito de compras en el HTML
function carritoHTML() {
  // Limpia el HTML
  limpiarHTML();

  // Recorre el carrito y genera el HMTL
  articulosCarrito.forEach((curso) => {
    const { imagen, titulo, precio, cantidad, id } = curso;

    // Crear nodos
    const row = document.createElement('tr');
    const tdImg = document.createElement('td');
    const tdTitle = document.createElement('td');
    const tdPrice = document.createElement('td');
    const tdQty = document.createElement('td');
    const tdDelete = document.createElement('td');

    const divQty = document.createElement('div');
    const addQty = document.createElement('button');
    const lessQty = document.createElement('button');
    const img = document.createElement('img');
    const del = document.createElement('a');

    // Agregar contenido
    img.src = imagen;
    img.width = 100;
    tdImg.appendChild(img);

    tdTitle.textContent = titulo;
    tdPrice.textContent = precio;

    addQty.textContent = '+';
    addQty.addEventListener('click', () => {
      addQtyArticle(id);
    });

    lessQty.textContent = '-';
    lessQty.addEventListener('click', () => {
      lessQtyArticle(id);
    });

    divQty.classList.add('qty');
    divQty.append(addQty, cantidad, lessQty);
    tdQty.appendChild(divQty);

    del.href = '#';
    del.classList.add('borrar-curso');
    del.dataset.id = id;
    del.textContent = 'X';
    tdDelete.appendChild(del);

    // Añadir a la ram pricipal
    row.append(tdImg, tdTitle, tdPrice, tdQty, tdDelete);
    fragment.appendChild(row);
    contendorCarrito.appendChild(fragment);
  });

  // Agregar el carrito de compras al storage
  sincronizarStorage();

  let totalProducts = 0;
  articulosCarrito.forEach((articulo) => {
    totalProducts += articulo.cantidad;
  });

  addCount(totalProducts);
}

function sincronizarStorage() {
  localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

// Mostrar cantidad
function addCount(total) {
  if (total > 999) {
    countSpan.textContent = '+999';
    return;
  }
  countSpan.textContent = total;
}

// Añadir un articulo desde el btn
function addQtyArticle(id) {
  // Actualizamos la cantidad
  const cursos = articulosCarrito.map((curso) => {
    if (curso.id === id) {
      curso.cantidad++;
      return curso;
    } else {
      return curso;
    }
  });
  articulosCarrito = [...cursos];

  carritoHTML();
}

// Eliminar un articulo desde el btn
function lessQtyArticle(id) {
  // Eliminar si no tiene cantidad
  articulosCarrito.map((curso) => {
    if (curso.cantidad === 0) {
      articulosCarrito = articulosCarrito.filter((curso) => curso.id !== id);
      carritoHTML();
      return
    }
  })

  // Actualizamos la cantidad
  const cursos = articulosCarrito.map((curso) => {
    if (curso.id === id) {
      curso.cantidad--;
      return curso;
    } else {
      return curso;
    }
  });

  articulosCarrito = [...cursos];

  carritoHTML();
}

// Elimina los cursos del tbody
function limpiarHTML() {
  // Forma Lenta
  // contendorCarrito.innerHTML = '';

  while (contendorCarrito.firstChild) {
    contendorCarrito.removeChild(contendorCarrito.firstChild);
  }
}
