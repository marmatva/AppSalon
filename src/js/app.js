document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp(){
    mostrarServicios();
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