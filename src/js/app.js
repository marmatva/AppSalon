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

    //Paginacion siguiente y anterior
    paginaSiguiente();
    paginaAnterior();

    //Comprueba la pagina actual para ocultar o mostrar la paginacion
    botonesPaginador();

}

function mostrarSeccion(){
    //Eliminar mostar seccion de la seccion anterior
    const seccionAnterior=document.querySelector('.mostrar-seccion');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    //Muestra seccion
    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //Elimina la clase del Tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }
                
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
            botonesPaginador();
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

function paginaSiguiente(){
    const paginaSiguiente= document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', ()=>{
        pagina++;
        botonesPaginador();
    })
}

function paginaAnterior(){
    const paginaAnterior= document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', ()=>{
        pagina--;
        botonesPaginador();
    })
}

function botonesPaginador(){
    const paginaSiguiente= document.querySelector('#siguiente');
    const paginaAnterior= document.querySelector('#anterior');

    if(pagina===1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar'); 
    } else if (pagina===3){
        paginaAnterior.classList.remove('ocultar'); 
        paginaSiguiente.classList.add('ocultar'); 
    } else{
        paginaAnterior.classList.remove('ocultar'); 
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();

}