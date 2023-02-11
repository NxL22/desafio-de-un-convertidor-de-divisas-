//variables globales
let apiURL = "https://mindicador.cl/api/";

let codigoMonedas = ["dolar", "euro"];

let grafico;

//seleccionar los diferentes elementos:
let inputMontoPeso = document.querySelector("#montoPesos");
let selectMonedaCambio = document.querySelector("#monedaCambio");
let parrafoMensaje = document.querySelector("#mensaje");
let botonBuscar = document.querySelector("#botonBuscar");
let myChart = document.querySelector("#myChart");
renderSelect()

botonBuscar.addEventListener("click", async function () {
    let codigoMoneda = selectMonedaCambio.value;
    let moneda = await getMoneda(codigoMoneda);

    renderGrafico(moneda);


    //
    let montoPesos = parseFloat(inputMontoPeso.value);
    let valorCambio = await CalcularValorCambio(montoPesos, codigoMoneda)
    parrafoMensaje.innerHTML = ` Resultado: $${valorCambio} `
});

async function CalcularValorCambio(monto, codigoMoneda) {
    let moneda = await getMoneda(codigoMoneda);
    let valorMoneda = moneda.serie[0].valor;
    return (monto / valorMoneda).toFixed(2);;
}
//


async function renderSelect() {
    let monedas = await getMonedas(codigoMonedas);
    let html = ""

    for (const moneda of monedas) {
        let template = `
    <option value="${moneda.codigo}">${moneda.nombre}</option>
    `;

        html += template;
    }

    selectMonedaCambio.innerHTML += html;
}

async function getMonedas(arraysCodigos) {
    let monedas = [];
    for (let i = 0; i < arraysCodigos.length; i++) {
        const res = await fetch(apiURL + arraysCodigos[i]);
        let moneda = await res.json();

        monedas.push(moneda);
    }

    return monedas;
}

async function getMoneda(codigo) {
    try {
        const res = await fetch(apiURL + codigo);
        let moneda = await res.json();
        return moneda;
    } catch (error) {
        parrafoMensaje.innerHTML = "Se produjo un error en la consulta"
    }


}

function renderGrafico(moneda) {
    let serie10Ultimos = moneda.serie.slice(0, 10)

    const labels = serie10Ultimos.map(serie => serie.fecha.slice(0, 10)).reverse();
    const data = serie10Ultimos.map(serie => serie.valor).reverse();

    const datasets = [
        {
            label: "Historial ultimos 10 días",
            borderColor: "red",
            data
        }
    ];

    const conf = {
        type: "line",
        data: {
            labels,
            datasets
        }
    };

    myChart.innerHTML = "";

    if (grafico) {
        grafico.destroy();
    }

    grafico = new Chart(myChart, conf)
}


