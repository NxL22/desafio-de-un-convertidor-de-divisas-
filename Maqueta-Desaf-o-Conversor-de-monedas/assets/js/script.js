//Variables globales
let apiURL = "https://mindicador.cl/api/";

let codigoMonedas = ["dolar", "euro"];

let grafico;

//Seleccionar los diferentes elementos en el DOM:
let inputMontoPeso = document.querySelector("#montoPesos");
let selectMonedaCambio = document.querySelector("#monedaCambio");
let parrafoMensaje = document.querySelector("#mensaje");
let botonBuscar = document.querySelector("#botonBuscar");
let myChart = document.querySelector("#myChart");

//Renderizar el select de monedas:
renderSelect()

//Agregar un event listener al botón de 
//Búsqueda para calcular el valor de cambio y renderizar el gráfico:
botonBuscar.addEventListener("click", async function () {

//Obtener el código de la moneda seleccionada:
    let codigoMoneda = selectMonedaCambio.value;

//Obtener la información de la moneda:
    let moneda = await getMoneda(codigoMoneda);

//Renderizar el gráfico con los datos de la moneda elegida: 
    renderGrafico(moneda);


//Calcular el valor de cambio:
    let montoPesos = parseFloat(inputMontoPeso.value);
    let valorCambio = await CalcularValorCambio(montoPesos, codigoMoneda)

//Mostrar el resultado:
    parrafoMensaje.innerHTML = ` Resultado: $${valorCambio} `
});

//Función para calcular el valor de cambio:
async function CalcularValorCambio(monto, codigoMoneda) {

//Información de la moneda:
    let moneda = await getMoneda(codigoMoneda);

//Tener el valor de la moneda:
    let valorMoneda = moneda.serie[0].valor;

//Retornar y calcular el valor de la moneda:
    return (monto / valorMoneda).toFixed(2);;
}

//Función para renderizar el select de monedas:
async function renderSelect() {

//Obtener el codigo y nombre de las monedas:
    let monedas = await getMonedas(codigoMonedas);
    let html = ""

//Generar el HTML para cada opción del select:
    for (const moneda of monedas) {
        let template = `
    <option value="${moneda.codigo}">${moneda.nombre}</option>
    `;

//Agregar al HTML:
        html += template;
    }

    selectMonedaCambio.innerHTML += html;
}

async function getMonedas(arraysCodigos) {

//Arreglo para almacenar los objetos moneda:
    let monedas = [];

//Ciclo para recorrer el arreglo de códigos:
    for (let i = 0; i < arraysCodigos.length; i++) {

// Realizamos una petición asíncrona para obtener la información de la moneda:
        const res = await fetch(apiURL + arraysCodigos[i]);

//"Parseamos" la respuesta a formato JSON:
        let moneda = await res.json();

//Añadimos el objeto moneda al arreglo:
        monedas.push(moneda);
    }

//Retornamos el array de monedas:
    return monedas;
}

async function getMoneda(codigo) {
    try {

//Realizamos una petición asíncrona para obtener la información de la moneda:
        const res = await fetch(apiURL + codigo);

//"Parseamos" la respuesta a formato JSON:
        let moneda = await res.json();

//Retornamos el objeto moneda:
        return moneda;
    } catch (error) {

//Si se produce un error en la consulta, mostramos un mensaje en un parrafo especificado:
        parrafoMensaje.innerHTML = "Se produjo un error en la consulta"
    }
}

function renderGrafico(moneda) {
    let serie10Ultimos = moneda.serie.slice(0, 10)

//Creamos un arreglo con las fechas, tomando solo los 10 primeros caracteres y lo invertimos:
    const labels = serie10Ultimos.map(serie => serie.fecha.slice(0, 10)).reverse();

//Creamos un arreglo con los valores de la moneda
    const data = serie10Ultimos.map(serie => serie.valor).reverse();

//Definimos los datos a mostrar en el gráfico
    const datasets = [
        {
            label: "Historial ultimos 10 días",
            borderColor: "blue",
            data
        }
    ];

//Configuración del gráfico
    const conf = {
        type: "line",
        data: {
            labels,
            datasets
        }
    };

//Vaciamos el contenedor del gráfico
    myChart.innerHTML = "";

//Si existe un gráfico previo, lo destruimos
    if (grafico) {
        grafico.destroy();
    }

//Creamos un nuevo gráfico
    grafico = new Chart(myChart, conf)
}


