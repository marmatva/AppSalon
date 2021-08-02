let pagina=1;

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp(){
    mostrarServicios();

    //Resalta Div Actual segun el Tab 
    mostrarSeccion();

    //Oculta o muestra una seccion 
    cambiarSeccion();

}

function mostrarSeccion(){
    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //Resalta el Tab actual
    const tabActual = document.querySelector(`[data-paso="${pagina}"]`);
    tabActual.classList.add('actual');

}

function cambiarSeccion(){
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach( enlace => {
        enlace.addEventListener('click', (e)=>{
            e.preventDefault();
            pagina=parseInt(e.target.dataset.paso);
            

            //Eliminar mostar seccion de la seccion anterior
            document.querySelector('.mostrar-seccion').classList.remove('mostrar-seccion');

            //Asigna la nueva seccion
            const seccion = document.querySelector(`#paso-${pagina}`);
            seccion.classList.add('mostrar-seccion');

            //Elimina la clase del Tab anterior
            document.querySelector('.tabs .actual').classList.remove('actual');

            //Asigna clase al nuevo Tab
            const tabActual = document.querySelector(`[data-paso="${pagina}"]`);
            tabActual.classList.add('actual');

        })
    })
}

async function mostrarServicios(){
    try{    
        const resultado = await fetch('./servicios.json');
        const db= await resultado.json();
        const { servicios }=db;

        // Generar HTML
        servicios.forEach( servicio => {
            const { nombre, precio, id }= servicio;

            //DOM Scripting
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            // Selecciona servicios para la cita
            servicioDiv.onclick = seleccionarServicio;

            //Inyectar precio y nombre
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);
           
            //Inyectarlo en el HTML
            document.querySelector('#servicios').appendChild(servicioDiv);
        })
    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e){
    let elemento;
    if(e.target.tagName === 'P'){
        elemento =  e.target.parentElement;
    } else{
        elemento = e.target;
    }

    if(elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');
    } else{
        elemento.classList.add('seleccionado');
    }

}