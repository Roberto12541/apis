let jsonIngredientes;
let jsonRecetas;
let objetoIngrediente;
let objetoReceta;
let objetoBebida;
let htmlNuevo = '';

$(document).ready(
    function ()
    {
        listarIngredientes();
    }
);

function listarIngredientes()
{
    $.ajax({
        url: "https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list",
        success(data){
            pintarIngredientes(data);
        },
        error: function(jqXHR, estatusError, textoError){
            alertify.alert('Â¡AtenciÃ³n', `Error: ${textoError} <br />Estatus ${estatusError}`);
        }
    });
}

function pintarIngredientes(datos)
{
    htmlNuevo = '';
    jsonIngredientes = datos.drinks;
    if(jsonIngredientes.length > 0){
        for(indice = 1; indice < jsonIngredientes.length; indice++){
            objetoIngrediente = jsonIngredientes[indice];
            htmlNuevo += `<a href="javascript: listarRecetas('${objetoIngrediente.strIngredient1}');" class="list-group-item list-group-item-action">${objetoIngrediente.strIngredient1}</a>`;
        }
    } else {
        htmlNuevo += `<a href="#" class="list-group-item list-group-item-action">No hay ingredientes...</a>`;
        alertify.alert('Â¡AtenciÃ³n', 'No se recibieron ingredientes...');
    }
    $('#divIngredientes').html(htmlNuevo);
}

function listarRecetas(ingrediente)
{
    if(ingrediente.trim() == ""){
        alertify.alert('Â¡AtenciÃ³n', `El ingrediente esta vacio<br />No se ha enviado nada al servidor.`);
        return;
    }
    $.ajax({
        url: "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + ingrediente,
        success(data){
            pintarRecetas(data);
        },
        error: function(jqXHR, estatusError, textoError){
            alertify.alert('Â¡AtenciÃ³n', `Error: ${textoError} <br />Estatus ${estatusError}`);
        }
    });
}

function pintarRecetas(datos)
{
    htmlNuevo = '';
    jsonRecetas = datos.drinks;
    if(jsonRecetas.length > 0){
        for(indice = 1; indice < jsonRecetas.length; indice++){
            objetoReceta = jsonRecetas[indice];
            htmlNuevo += `<a href="javascript: listarBebida('${objetoReceta.idDrink}');" class="list-group-item list-group-item-action">${objetoReceta.strDrink}</a>`;
        }
    } else {
        htmlNuevo += `<a href="#" class="list-group-item list-group-item-action">No hay recetas...</a>`;
        alertify.alert('Â¡AnteciÃ³n!', 'No se recibieron recetas.');
    }
    $('#divRecetas').html(htmlNuevo);
}

function listarBebida(idBebida)
{
    console.log(idBebida);
    if(Number(idBebida) <= 0){
        alertify.alert('Â¡AtenciÃ³n!', `El ID de la bebida esta vacio<br />No se ha enviado nada al servidor.`);
        return;
    }
    resetearBebida();
    $.ajax({
        url: "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + idBebida,
        success(data){
            pintarBebida(data.drinks[0]);
        },
        error: function(jqXHR, estatusError, textoError){
            alertify.alert('Â¡AtenciÃ³n', `Error: ${textoError} <br />Estatus ${estatusError}`);
        }
    });
}

function pintarBebida(bebida)
{
    objetoBebida = bebida;
    $('#imgBebida').attr("src", objetoBebida.strDrinkThumb);
    $('#h5Bebida').html(objetoBebida.strDrink);
    $('#pBebida').html(objetoBebida.strInstructions);
}

function resetearBebida()
{
    $('#imgBebida').attr('src', 'https://picsum.photos/id/225/300');
    $('#h5Bebida').html('&nbsp;');
    $('#pBebida').html('<i class="fa-solid fa-spinner fa-spin-pulse fa-spin-reverse"></i>');
}