const shopContent = document.getElementById("shopContent")
const carritoContainer = document.getElementById("carritoContainer")
const verCarrito = document.getElementById("verCarrito")
const cantCarrito = document.getElementById("cantCarrito")

//app

fetch('./productos.json')
  .then(response => response.json())
  .then(productos =>   productos.forEach((product) => {
    let content = document.createElement("div")
    content.className = "card-product"
    content.innerHTML = `
      <h4>${product.nombre}</h4>
      <h5>$${product.precio}</h5>
      <img src=${product.imgUrl}>
    `
    shopContent.append(content)
  
    let comprar = document.createElement("button")
    comprar.innerText = "Agregar al Carrito"
    comprar.className = "comprar"
  
    content.append(comprar)
  
    comprar.addEventListener("click", () => {
      const repeat = carrito.some((repeatProduct) => repeatProduct.id === product.id)
  
      if (repeat) {
        carrito.map((prod) => {
          if (prod.id === product.id) {
            prod.cantidad++
          }
        })
      } else {
        carrito.push({
          id: product.id,
          img: product.imgUrl,
          nombre: product.nombre,
          precio: product.precio,
          cantidad: product.cantidad,
        })
      }
      carritoCounter()
      saveLocal()
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Su producto ha sido agregado al carrito.',
    showConfirmButton: false,
    timer: 1500
  })
      
    })
  }))

let carrito = JSON.parse(localStorage.getItem("carritoStorage")) || []

//carrito
const crearCarrito = () => {
  carritoContainer.innerHTML = ""
  carritoContainer.style.display = "flex"
  const carritoHeader = document.createElement("div")
  carritoHeader.className = "carrito-header"
  carritoHeader.innerText = `
  Carrito de Compras:
  `
  carritoContainer.append(carritoHeader)

  const carritoButton = document.createElement("h2")
  carritoButton.innerText = "X"
  carritoButton.className = "carrito-header-button"

  carritoHeader.append(carritoButton)

  carritoButton.addEventListener("click", () => {
    carritoContainer.style.display = "none"
  })

  carrito.forEach((product) => {
    let carritoContent = document.createElement("div")
    carritoContent.className = "carrito-content"
    carritoContent.innerHTML = `
    <h3> ${product.nombre}</h3>
    <p> $${product.precio}</p>
    <img src="${product.img}">
    <span class="restarProdCarr"> - </span>
    <p>Cantidad: ${product.cantidad}</p>
    <span class="sumarProdCarr"> + </span>
    <p>Sub-Total: $${product.cantidad * product.precio}
    <span class="delete-prod"> ❌ </span>
    `
    carritoContainer.append(carritoContent)

    let restar = carritoContent.querySelector(".restarProdCarr")

    restar.addEventListener("click", () => {
      if (product.cantidad !== 1) {
        product.cantidad--
      }
      crearCarrito()
      saveLocal()
    })
    let sumar = carritoContent.querySelector(".sumarProdCarr")
    
    sumar.addEventListener("click", () => {
      product.cantidad++
      crearCarrito()
      saveLocal()
    })
    
    let deleteProd = carritoContent.querySelector(".delete-prod")
    
    deleteProd.addEventListener("click", () => {
      deleteProduct(product.id)
      carritoCounter()
      crearCarrito()
      saveLocal()
    })
  });

  const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0)

  const totalBuying = document.createElement("div")
  totalBuying.className = "total-content"
  totalBuying.innerHTML = `
    Total a Pagar: $${total}
  `
  carritoContainer.append(totalBuying)
}

verCarrito.addEventListener("click", crearCarrito)

const deleteProduct = (id) => {
  const prodIdSearch = carrito.find((element) => element.id === id)
  carrito = carrito.filter((carritoId) => {
    return carritoId !== prodIdSearch
  })
  carritoCounter()
  saveLocal()
  crearCarrito()
}

const carritoCounter = () => {
  cantCarrito.style.display = "block"
  const carritoLenght = carrito.length
  localStorage.setItem("carritoLenght", JSON.stringify(carritoLenght))
  cantCarrito.innerText = JSON.parse(localStorage.getItem("carrito.length"))
}

console.log(carritoCounter)

//localStorage
const saveLocal = () => {
  localStorage.setItem("carritoStorage", JSON.stringify(carrito))
}
