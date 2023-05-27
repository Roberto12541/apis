let jsonGatos;
let objetoGato;
let htmlNuevo = '';

$(document).ready(
    function()
    {
        listarEtiquetas();
    }
);

function listarEtiquetas()
{
    $.ajax({
        url: "https://cataas.com/api/tags",
        success(data){
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
    jsonGatos = datos;
    if(jsonGatos.length > 0){
        for (indice = 1; indice < jsonGatos.length; indice++) {
            objetoGato = jsonGatos[indice];
            htmlNuevo += `<a href="javascript: verGato('${objetoGato}');" class="list-group-item list-group-item-action">${objetoGato}</a>`;
        }
    } else {
        htmlNuevo += `<a href="javascript: alert('SIN_GATOS'); class="list-group-item list-group-item-action">Sin Gatos...</a>`;
        alertify.alert('¡Atencion!', 'No se recibieron gatos.');
    }
    $('#divLista').html(htmlNuevo);
}

function verGato(etiqueta)
{
    $.ajax({
        url: `https://cataas.com/cat/${etiqueta}`,
        xhrFields: {
            responseType: 'blob'
        },
        success (data) {
            const url = window.URL || window.webkitURL;
            const src = url.createObjectURL(data);
            $('#imgGato').attr("src", src);
        },    
        error : function(jqXHR, estatusError, textoError){
            $('#imgGato').attr("src", "https://www.antonio.com.mx/imagenes/404_cat_not_found.jpg");
            alertify.alert('¡Atencion!', '404<br />Gato no disponible');
        }
    });
}
