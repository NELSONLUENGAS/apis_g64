const api_url = 'https://mindicador.cl/api/'
let myCanvaChart = null;


const get_coins = async (url) => {
    try {

        const coins_data = await fetch(url)
        const coins = await coins_data.json()

        const coinsFiltered = Object.keys(coins).filter(indicador => coins[indicador]['unidad_medida'] === 'Pesos')

        const coins_info = coinsFiltered.map(coin => ({
            codigo: coins[coin]['codigo'],
            nombre: coins[coin]['nombre'],
            valor: coins[coin]['valor']
        }))


        const selectContainer = document.querySelector('#coins')

        coins_info.forEach(coin => {
            selectContainer.innerHTML += `
                <option value="${coin.codigo}">${coin.nombre}</option>
            `
        })


    } catch (error) {
        console.log(error)
    }
}

const get_coin_data = async (coin_name) => {
    const coins_data = await fetch(`${api_url}${coin_name}`)
    const coins = await coins_data.json()
    const data_filtered = coins.serie.splice(0, 10)

    return data_filtered
}

const get_coin_price = async (coin_name) => {
    const coins_data = await fetch(`${api_url}${coin_name}`)
    const coin = await coins_data.json()

    return coin.serie[0].valor
}

const calcular = async () => {
    const clp = document.querySelector('#clp').value
    const coin_name = document.querySelector('#coins').value
    const coin_value = await get_coin_price(coin_name)

    const conver = (clp / coin_value).toFixed(2)
    console.log(conver)
}

document.querySelector('#calcular').addEventListener('click', calcular)

document.querySelector('#coins').addEventListener('change', async function (event) {

    const coin = event.target.value

    document.getElementById('loading').innerText = 'Cargando...'

    if (myCanvaChart) {
        myCanvaChart.destroy()
    }

    const coin_dates = await get_coin_data(coin)

    document.getElementById('loading').innerText = ''



    const labels = coin_dates.map(coin_date => coin_date.fecha)
    const data = coin_dates.map(coin_date => coin_date.valor)


    const datasets = [
        {
            label: "Indicadores",
            borderColor: "rgb(255, 99, 132)",
            data
        }
    ];

    const data_render = { labels, datasets };

    handleRenderChart(data_render)
})


const handleRenderChart = (data) => {

    const config = {
        type: "line",
        data
    };

    const myChart = document.getElementById("myChart");

    myChart.style.backgroundColor = "white";

    myCanvaChart = new Chart(myChart, config);
}


get_coins(api_url)