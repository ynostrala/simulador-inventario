//Simulador de inventario de stock
class Stock {
    constructor(cantidad){
        if(localStorage.getItem("inventario")){
            let stockStorage = JSON.parse(localStorage.getItem("inventario"));
            this.nombres = stockStorage;
            this.cantidad = cantidad;
        }else{
            this.nombres = [];
        }
    }
    
    ingresoArt(nuevoArt){
        this.nombres.push(nuevoArt);
        // guardo en el storage los articulos
        localStorage.setItem("inventario", JSON.stringify(this.nombres))
        
        //Uso de la librería Toastify
        Toastify({
            text: "El articulo fue ingresado al stock con exito",
            className: "info",
            position: "center",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
        this.mostrarStock();
    }

    mostrarStock(){
        //Limpio el HTML
        inventarioNombre.innerHTML =``
        inventarioCant.innerHTML =``
        inventarioEgreso.innerHTML =`<option selected>Seleccionar...</option>`
        inventarioSumar.innerHTML =`<option selected>Seleccionar...</option>`
        inventarioEliminar.innerHTML =`<option selected>Seleccionar...</option>`

        //actualizo el html con innerHTML
        for(let art of this.nombres){
            inventarioNombre.innerHTML +=`
            <li class="list-group-item d-flex justify-content-between align-items-start">
                <div class="ms-2 me-auto">${art.nombres}</div>
                <span class="badge bg-primary rounded-pill">${art.cantidad}</span>
            </li>`
            if(art.cantidad == 0){
                inventarioEgreso.innerHTML +=``
            }else{
                inventarioEgreso.innerHTML +=`<option value="${art.nombres}">${art.nombres}</option>`
            }
            inventarioEliminar.innerHTML +=`<option value="${art.nombres}">${art.nombres}</option>`
            inventarioSumar.innerHTML +=`<option value="${art.nombres}">${art.nombres}</option>`
        }
    }

    sumarArt(nombre, cantidad){
        for(const art of this.nombres){
            if(art.nombres == nombre){
                art.cantidad += cantidad;
            }
        }
        //Actualizo el Storage
        localStorage.setItem("inventario", JSON.stringify(this.nombres))
        this.mostrarStock();
    }

    egresoArt(nombre, cantidad){
        for(const art of this.nombres){
            if(art.nombres == nombre){
                if(cantidad <= art.cantidad){
                    art.cantidad -= cantidad;
                }
            }
        }
        //Actualizo el Storage
        localStorage.setItem("inventario", JSON.stringify(this.nombres))
        this.mostrarStock();
    }

    eliminarArt(nombre){
        for(let art of this.nombres){
            if(art.nombres == nombre){
                let indice = this.nombres.indexOf(art);
                this.nombres.splice(indice,1);
            }
        }
        // Actualizo el Storage
        localStorage.setItem("inventario", JSON.stringify(this.nombres))
        this.mostrarStock();
    }
    
    buscarArt(nombreArt){
        //Limpio el HTML
        inventarioNombre.innerHTML =``
        inventarioCant.innerHTML =``
        let busqueda = this.nombres.filter((art) => art.nombres.includes(nombreArt));
        busqueda.forEach((art) => {
            inventarioNombre.innerHTML +=`
            <li class="list-group-item d-flex justify-content-between align-items-start">
                <div class="ms-2 me-auto">${art.nombres}</div>
                <span class="badge bg-primary rounded-pill">${art.cantidad}</span>
            </li>`
        })
    }
}

const stock = new Stock();

//elementos
const inventarioNombre = document.querySelector("#inventarioNombre");
const inventarioCant = document.querySelector("#inventarioCantidad");
const inventarioEgreso = document.querySelector("#inventarioEgreso");
const inventarioEliminar = document.querySelector("#inventarioEliminar");
const inventarioSumar = document.querySelector("#inventarioSumar");

const btnAgregar = document.querySelector("#btnAgregar");
const btnSumar = document.querySelector("#btnSumar");
const btnQuitar = document.querySelector("#btnQuitar");
const btnEliminar = document.querySelector("#btnEliminar");
const btnListar = document.querySelector("#btnListar");
const btnBuscar = document.querySelector("#btnBuscar");

//agrego eventos a los elementos
btnAgregar.addEventListener("click", agregarArticulo);
btnSumar.addEventListener("click", sumarArticulo);
btnBuscar.addEventListener("click", buscarArticulo);
btnEliminar.addEventListener("click", eliminarArticulo);
btnQuitar.addEventListener("click", quitarArticulo);


function agregarArticulo(){
    let nombre = document.getElementById("nombre").value;
    let cantidad = 0;
    //crea el objeto con los datos del articulo.
    const nuevoArt = {
        nombres: nombre,
        cantidad: parseInt(cantidad),
    }

    for(let art of stock.nombres){
        if(art.nombres == nombre){
            Swal.fire({
                icon: 'error',
                title: 'Ya existe un articulo con el mismo nombre',
                text: 'Por favor cambie el nombre del artículo o elimínelo',
            })
        }
    }
    stock.ingresoArt(nuevoArt);
}

function sumarArticulo(){
    let nombre = document.getElementById("inventarioSumar").value;
    let cantidad = parseInt(document.getElementById("cantidadIngreso").value);
    stock.sumarArt(nombre, cantidad);
}

function quitarArticulo(){
    let nombre = document.getElementById("inventarioEgreso").value;
    let cantidad = parseInt(document.getElementById("cantidadEgreso").value);
    stock.egresoArt(nombre, cantidad);
}


function eliminarArticulo(){
    let nombre = document.getElementById("inventarioEliminar").value;
    
    //uso de la librería Sweetalert
    Swal.fire({
        title: '¿Está seguro que desea eliminar el articulo del inventario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: "Cancelar",
        confirmButtonText: 'Confirmar'
    }).then((result) => {
        if (result.isConfirmed) {
            
            stock.eliminarArt(nombre);
            setTimeout(function(){
                Swal.fire(
                'Operacion exitosa!',
                'El artículo fue eliminado del inventario',
                )
            },1000)
        }
    })
}

function buscarArticulo(){
    let nombre = document.getElementById("buscarArt").value;
    stock.buscarArt(nombre);
}

stock.mostrarStock();