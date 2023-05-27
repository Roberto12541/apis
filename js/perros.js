let jsonPerros;
let objetoPerro;
let htmlNuevo = '';

$(document).ready(
    function ()
    {
        listarEtiquetas();
    }
);

function listarEtiquetas()
{
    $.ajax({
        url: "https://api.thedogapi.com/v1/breeds",
        beforeSend: function( xhr ) {
            xhr.setRequestHeader('X-Api-Key', '3ba5e4e8-9fef-4a88-89f9-b9d983009ecf');
        },
        success(data) {
            pintarEtiquetas(data);
        },
        error : function(jqXHR, estatusError, textoError){
            alertify.alert('¡Atencion!', `Error: ${textoError} <br />Estatus ${estatusError}`);
        }
    });
}

function pintarEtiquetas(datos)
{
    htmlNuevo = '';
    jsonPerros = datos;
    if (jsonPerros.length > 0){
        for (indice = 1; indice < jsonPerros.length; indice++) {
            objetoPerro = jsonPerros[indice];
            htmlNuevo += `<a href="javascript: verPerro('${objetoPerro.image.id}');" class="list-group-item list-group-item-action">${objetoPerro.name}</a>`;
        }
    } else {
        htmlNuevo += `<a href="javascript: alert('SIN_PERROS'); class="list-group-item list-group-item-action">Sin Perros...</a>`;
        alertify.alert('¡Atencion!', 'No se recibieron perros.');
    }
    $('#divLista').html(htmlNuevo);
}

function verPerro(raza)
{
    $.ajax({
        url: `https://api.thedogapi.com/v1/images/${raza}`,
        success (data) {
            $('#imgPerro').attr("src", data.url);
        },    
        error : function(jqXHR, estatusError, textoError){
            $('#imgPerro').attr("src", "https://www.antonio.com.mx/imagenes/404_dog_not_found.jpg");
            alertify.alert('¡Atencion!', '404<br />Perro no disponible');
        }
    });
}
