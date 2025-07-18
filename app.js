
  let carrito = [];
  productos.forEach(p => {
  contenedor.innerHTML += `
    <div class="col-md-4 mb-4">
      <div class="card h-100 text-center">
        <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}">
        <div class="card-body">
          <h4 class="card-title">${p.nombre}</h4>
          <p>Precio: S/ ${p.precio.toFixed(2)}</p>
          <button class="btn btn-success" onclick="agregarAlCarrito('${p.nombre}', ${p.precio}, '${p.imagen}')">Agregar al carrito</button>
        </div>
      </div>
    </div>
  `;
});

  function agregarAlCarrito(nombre, precio, imagen) {
    const item = carrito.find(p => p.nombre === nombre);
    if (item) {
      item.cantidad++;
      item.total = item.precio * item.cantidad;
    } else {
      carrito.push({ nombre, precio, cantidad: 1, total: precio, imagen });
    }
    renderCarrito();
  }

  function eliminar(nombre) {
    carrito = carrito.filter(p => p.nombre !== nombre);
    renderCarrito();
  }

  function renderCarrito() {
    const tbody = document.getElementById("carritoBody");
    tbody.innerHTML = "";
    let total = 0;
    carrito.forEach(p => {
      total += p.total;
      tbody.innerHTML += `
        <tr>
          <td>${p.nombre}</td>
          <td>S/ ${p.precio.toFixed(2)}</td>
          <td>${p.cantidad}</td>
          <td>S/ ${p.total.toFixed(2)}</td>
          <td><button class="btn btn-danger btn-sm" onclick="eliminar('${p.nombre}')">ELIMINAR</button></td>
        </tr>`;
    });
    document.getElementById("carritoTotal").textContent = total.toFixed(2);
  }

  document.getElementById("formFactura").addEventListener("submit", function (e) {
    e.preventDefault();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const nombre = document.getElementById("nombre").value;
    const dni = document.getElementById("dni").value;
    const celular = document.getElementById("celular").value;

    let y = 20;
    doc.setFontSize(16);
    doc.text("FACTURA DE COMPRA", 70, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Cliente: ${nombre}`, 10, y);
    doc.text(`DNI: ${dni}`, 140, y);
    y += 10;
    doc.text(`Celular: ${celular}`, 10, y);
    y += 10;

    doc.text("Detalle de la compra:", 10, y);
    y += 10;
    carrito.forEach(p => {
      doc.text(`${p.cantidad} x ${p.nombre} = S/ ${p.total.toFixed(2)}`, 10, y);
      y += 10;
    });

    const total = carrito.reduce((sum, p) => sum + p.total, 0);
    y += 5;
    doc.setFontSize(14);
    doc.text(`TOTAL: S/ ${total.toFixed(2)}`, 10, y);

    doc.save("factura.pdf");

    carrito = [];
    renderCarrito();
    this.reset();
  });


