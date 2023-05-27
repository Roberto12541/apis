let jsonIngredientes;
let jsonRecetas;
let objetoIngrediente;
let objetoReceta;
let objetoPlatillo;
let htmlNuevo = '';

$(document).ready(
    function()
    {
        listarIngredientes();
    }    
);

function listarIngredientes()
{
    $.ajax({
        url: "https://www.themealdb.com/api/json/v1/1/list.php?i=list",
        success(data){
            pintarIngredientes(data);
        },
        error : function(jqXHR, estatusError, textoError){
            alertify.alert('Â¡AtenciÃ³n!', `Error: ${textoError} <br> />Estatus ${estatusError}`);
        }
    });    
}

function pintarIngredientes(datos)
{
    htmlNuevo = '';
    jsonIngredientes = datos.meals;
    if (jsonIngredientes.length > 0){
        for (indice = 1; indice < jsonIngredientes.length; indice ++){
            objetoIngrediente = jsonIngredientes[indice];
            htmlNuevo += `<a href= "javascript: listarRecetas('${objetoIngrediente.strIngredient}');" class="list-group-item list-group-item-action"> ${objetoIngrediente.strIngredient}</a>`;
        }
    } else {
        htmlNuevo += `<a href="#" class="list-group-item list-group-item-action">NO hay ingredientes ... </a>`;
        alertify.alert('Â¡AtenciÃ³n!', 'No se recibieron Ingredientes...');
    }
    $('#divIngredientes').html(htmlNuevo);
}

function listarRecetas(ingrediente)
{
    if (ingrediente.trim() == ""){
        alertify.alert('Â¡AtenciÃ³n!', `El ingrediente estÃ¡ vacÃ­o <br />No se ha enviado nada al servidor.`);
        return;
    }
    $.ajax({
        url: "https://www.themealdb.com/api/json/v1/1/filter.php?i=" + ingrediente,
        success(data) {
            pintarRecetas(data);
        },
        error: function (jqXHR, estatusError, textoError){
            alertify.alert('Â¡AtenciÃ³n!', `Error: ${textoError} <br />Estatus ${estatusError}`);
        }
    });
}

function pintarRecetas(datos)
{
    htmlNuevo = '';
    jsonRecetas = datos.meals;
    if (jsonRecetas.length > 0){
        for(indice = 1; indice < jsonRecetas.length; indice++){
            objetoReceta = jsonRecetas[indice];
            htmlNuevo += `<a href= "javascript: listarPlatillo('${objetoReceta.idMeal}');" class="list-group-item list-group-item-action">${objetoReceta.strMeal}</a>`;            
        }
    } else {
        htmlNuevo += `<a href="#" class="list-group-item list-group-item-action"> NO hay Recetas...</a>`;
        alertify.alert('Â¡AtenciÃ³n!', 'No se recibieron Recetas...');
    }
    $('#divRecetas').html (htmlNuevo);
}

function listarPlatillo(idPlatillo)
{
    console.log(idPlatillo);
    if( Number (idPlatillo) <= 0) {
        alertify.alert('Â¡AtenciÃ³n!', `El ID del platillo estÃ¡ vacÃ­o <bt /> No se ha enviado nada al servidor.`);
        return;
    }
    resetearPlatillo();
    $.ajax({
        url: "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + idPlatillo,
        success(data){
            pintarPlatillo(data.meals[0]);
        },
        error : function(jqXHR, estatusError, textoError) {
            alertify.alert('Â¡AtenciÃ³n!', `Error: ${textoError} <br />Estatus ${estatusError}`);            
        }
    });
}

function pintarPlatillo(platillo)
{
    objetoPlatillo = platillo;
    $('#imgPlatillo').attr("src", objetoPlatillo.strMealThumb);
    $('#h5Platillo').html(objetoPlatillo.strMeal);
    $('#pPlatillo').html(objetoPlatillo.strInstructions);
}

function resetearPlatillo()
{
    $('#imgPlatillo').attr('src', 'https://picsum.photos/id/490/300');
    $('#h5Platillo').html('&nbsp;');
    $('#pPlatillo').html('<i class="fa-solid fa-spiner fa-spin-pulse fa-spin-reverse"></i>');
}