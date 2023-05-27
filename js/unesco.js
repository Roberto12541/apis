const URL = 'https://databases.utn.red/api/';
let jsonPaises = null;
let objetoPais = null;
let datos = null;
let htmlNuevo = null;
let arrayURLs = ['0','demografia.php','deuda.php','expectativa.php','fertilidad.php','gasto.php','pib.php'];
let arrayTipos = ['0', 'DEMOGRAFIA' , 'DEUDA' , 'EXPECTATIVA' , 'FERTILIDAD', 'GASTO', 'PIB'];

$(document).ready(
    function ()
    {
        listarPaises();
    }
);

function listarPaises()
{
    datos = JSON.stringify( { 'peticion' : 'LISTAR' } );
    $.ajax ({
        url: `${URL}paises.php`,
        method: 'POST',
        data: datos,
        success(data) {
            pintarPaises(data);
        },
        error : function(jqXHR, estatusError, textoError) {
            alertify.alert('Â¡AtenciÃ³n!', `Error: ${textoError} <br> Estatus: ${estatusError}`);
        }
    });
}

function pintarPaises(respuesta)
{
    htmlNuevo = '';
    jsonPaises = respuesta.datos;
    if (jsonPaises.length > 0) {
        for(indice = 1;indice < jsonPaises.length;indice++) {
            objetoPais = jsonPaises[indice];
            htmlNuevo += `<a href="javascript: listarPais('${indice}');" class="list-group-item list-group-item-action">${objetoPais.pais}</a>`;
        }
    } else {
        htmlNuevo += `<a href="#" class="list-group-item list-group-item-action">NO hay Paises...</a>`;
        alertify.alert('¡Atencion!', 'No se recibieron Paises...' );
    }
    $('#divColumnaPaises').html(htmlNuevo);
}

function colorear()
{
    let color = '#';
    color += Math.floor(256 * Math.random()).toString(16).toUpperCase();
    color += Math.floor(256 * Math.random()).toString(16).toUpperCase();
    color += '00'; //Solo quiero colores de '#000000' hasta '#FFFF00' ... en teria
    return color;
}

async function listarPais(indice)
{
    objetoPais =  jsonPaises[indice];
    datos = JSON.stringify( {'peticion' : 'LISTAR', 'pais': Number(objetoPais.id_pais)} );
    //
    let promesas = [];
    for(indice=1; indice<=6; indice++){
        promesas.push(
            await fetch( `${URL+arrayURLs[indice]}`, {method: 'POST', body: datos} )
        );
    }
    Promise.all( promesas )
    .then(
        async respuesta => {
            //console.log(respuesta);
            for(indice=0; indice<respuesta.length; indice++) {
                datosGrafica = await respuesta[indice].json();
                pintarGrafica(datosGrafica, arrayTipos[indice+1]);
            }
        }
    )
    .catch(
        error => {
            console.error( error );
        }
    );
}

function pintarGrafica(respuesta, grafica)
{
    let tipoGrafica = null;
    let elementoGrafica = null;
    let descripcionGrafica = null;
    let tituloGrafica = null;
    let textoY = null;
    let serieTexto = null;
    let colorSerie = null;
    switch(grafica.trim()) {
        case 'DEMOGRAFIA':
            descripcionGrafica = 'Descripcion de la Grafica';
            tipoGrafica = 'area';
            elementoGrafica = 'divGraficaDemografia';
            tituloGrafica = `Demografia de ${objetoPais.pais}`;
            textoY = 'Miles de personas';
            serieTexto = `Personas ${objetoPais.iso3}`;
            colorSerie = colorear();
            break;
        case 'DEUDA':
            elementoGrafica = 'divGraficaDeuda';
            tipoGrafica = 'column';
            descripcionGrafica = 'Descripcion de la Grafica';
            tituloGrafica = `Deuda de ${objetoPais.pais}`;
            textoY = '% del Gross National Income';
            serieTexto = `Deuda ${objetoPais.iso3}`;
            colorSerie = colorear();
            break;
        case 'EXPECTATIVA':
            elementoGrafica = 'divGraficaExpectativa';
            tipoGrafica = 'bar';
            descripcionGrafica = 'Descripcion de la Grafica';
            tituloGrafica = `Expectativa de vida de ${objetoPais.pais}`;
            textoY = 'Esperanza de vida al nacer, total (aÃ±os)';
            serieTexto = `${objetoPais.iso3} AÃ±os`;
            colorSerie = colorear();
            break;
        case 'FERTILIDAD':
            elementoGrafica = 'divGraficaFertilidad';
            tipoGrafica = 'area';
            descripcionGrafica = 'Descripcion de la Grafica';
            tituloGrafica = `Fertilidad ${objetoPais.pais}`;
            textoY = 'Tasa de fertilidad, total (nacimientos por mujer)';
            serieTexto = `${objetoPais.iso3} Nacimientos`;
            colorSerie = colorear();
            break;
        case 'GASTO':
            elementoGrafica = 'divGraficaGasto';
            tipoGrafica = 'column';
            descripcionGrafica = 'Descripcion de la Grafica';
            tituloGrafica = `Gasto ${objetoPais.pais}`;
            textoY = 'Gasto total del gobierno general (UMN a precios actuales)';
            serieTexto = `${objetoPais.iso3} Gasto`;
            colorSerie = colorear();
            break;
        case 'PIB':
            elementoGrafica = 'divGraficaPIB';
            tipoGrafica = 'bar';
            descripcionGrafica = 'Descripcion de la Grafica';
            tituloGrafica = `PIB ${objetoPais.pais}`;
            textoY = 'Producto Interno Bruto (PIB)';
            serieTexto = `${objetoPais.iso3} PIB`;
            colorSerie = colorear();
            break;
        default :
        // ERROR:
        alertify.alert ('¡Atencion', 'No hay ningun tipo de grafica seleccionada <br />NO se pintara nada.');
        return;
    }
    //Transformar datos para la grafica
    let arrayValores = [];
    let arrayEtiquetas = [];
    for(indice = 0; indice < respuesta.datos.length; indice++) {
        if(grafica.trim()=='FERTILIDAD') {
            arrayValores.push( Number(respuesta.datos[indice].valor)/100 ); //Porque esta en porcentaje
        } else {
            arrayValores.push( Number(respuesta.datos[indice].valor) );
        }

        arrayEtiquetas.push( respuesta.datos[indice].ano);
    }
    //Pintar grafica
    Highcharts.chart(elementoGrafica , {
        chart: {
            type: tipoGrafica
        },
        accessibility: {
            description: descripcionGrafica
        },
        title: {
            text: tituloGrafica
        },
        subtitle: {
            text: 'Fuente <a href="https://data.uis.unesco.org/" target="_blank">UNESCO Institute of Statistics (UIS)<a/>'
        },
        xAxis: {
            allowDecimals: false,
            categories: arrayEtiquetas
        },
        yAxis: {
            title: {
                text: textoY
            }
        },
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                }
            }
        },
        series: [{
            name: serieTexto,
            data: arrayValores,
            color: colorSerie
        }]
    });
    //debugger;
}