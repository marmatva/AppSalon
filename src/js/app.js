let pagina=1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

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

    //Muestra el resumen de la cita (o mensaje de error)
    mostrarResumen();

    //Almacena el nombre, fecha y hora en el Objeto
    nombreCita();
    fechaCita();
    horaCita();

    //Deshabilita dias pasados
    deshabilitarFechaAnterior();

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

        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id);
    } else{
        elemento.classList.add('seleccionado');

        const servicioObj={
            id: parseInt( elemento.dataset.idServicio ),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }

        agregarServicio(servicioObj);
    }

}

function eliminarServicio(id){
    const { servicios } = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id); 
}

function agregarServicio(servicioObj){
    const { servicios } = cita;
    cita.servicios=[...servicios, servicioObj];
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
        
        mostrarResumen();
    } else{
        paginaAnterior.classList.remove('ocultar'); 
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();

}

function mostrarResumen(){
    //Destructuring
    const { nombre, fecha, hora, servicios} = cita;

    //Seleccion el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    // Limpia HTML Previo
    while( resumenDiv.firstChild){
        resumenDiv.removeChild( resumenDiv.firstChild );
    }

    //Validacion de Objeto
    if(Object.values(cita).includes('')){
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de Servicios, hora, fecha o nombre';

        noServicios.classList.add('invalidar-cita');

        resumenDiv.appendChild(noServicios);

        return;
    }

    const headingCita = document.createElement('H3');
    headingCita.textContent='Resumen de Cita';

    //Mostrar el Resumen
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    //Iterar sobre el array de servicios

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent='Resumen de Servicios';

    serviciosCita.appendChild(headingServicios);

    servicios.forEach( servicio => {
        const { nombre, precio} = servicio;    
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent= nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent= precio;
        precioServicio.classList.add('precio');

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);

    } );

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);
    
    resumenDiv.appendChild(serviciosCita);
}

function nombreCita(){
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', e =>{
        const nombreTexto = e.target.value.trim();

        //Validacion nombreTexto no vacio

        if(nombreTexto === '' || nombreTexto.length < 3){
            mostrarAlerta('Nombre no valido', 'error');
        } else{
            const alerta = document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }

            cita.nombre = nombreTexto;
        }

    })
}

function mostrarAlerta(mensaje, tipo){
    //Si hay alerta previa, no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
        return;
    }
    
    //Crea alerta
    const alerta=document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo==='error'){
        alerta.classList.add('error');
    }

    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    //Elimiar la alerta despues de 3 segundos
    setTimeout(()=>{
        alerta.remove()
    },3000);
}

function fechaCita(){
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e =>{
        const dia = new Date (e.target.value).getUTCDay();
        
        if([0, 6].includes(dia)){
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fines de Semana no son permitidos', 'error');
        } else{
            removerAlerta();
            cita.fecha = fechaInput.value;
        }

    });
}

function deshabilitarFechaAnterior(){
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date();

    // Formato desdead: AAAA-MM-DD
    const year = fechaAhora.getFullYear();
    let mes = (fechaAhora.getMonth() + 1).toString();
    let dia = (fechaAhora.getDate() + 1).toString();

    if(mes.length<2){
        mes=0+mes
    }
    if(dia.length<2){
        dia=0+dia
    }

    const fechaDeshabilitar = `${year}-${mes}-${dia}`;

    inputFecha.min= fechaDeshabilitar;
    
}

function horaCita(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e =>{

        let horaCita = e.target.value;
        const hora = horaCita.split(':');

        if( hora[0]<10 || hora[0] >=18){
            setTimeout(()=>{
                inputHora.value='';
            },1000)
            mostrarAlerta('Hora invalida', 'error')
        } else{
            removerAlerta();
            cita.hora=horaCita;
        }
    })
}

function removerAlerta(){
    const alerta = document.querySelector('.alerta');
    if(alerta){
        alerta.remove();
    }
}