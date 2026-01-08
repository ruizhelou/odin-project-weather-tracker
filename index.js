async function getWeatherData(location, datetime1, datetime2) {
    let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}`
    if(datetime1 != null && datetime1 !== '') {
        console.log('adding datetime1')
        url += `/${datetime1}`
    }
    if(datetime2 != null && datetime2 !== '') {
        console.log('adding datetime2')
        url += `/${datetime2}`
    }
    url += `?key=EEMKUAAEHGRSNK2447KVJTMYW&iconSet=icons2`

    const response = await fetch(url)
    const responseJson = await response.json()
    console.log(responseJson)

    const weatherData = {
        weatherDays: [],
        weatherToday: { }
    }
    for(const day of responseJson.days) {
        weatherData.weatherDays.push({
            'datetime': day.datetime,
            'conditions': day.conditions,
            'description': day.description,
            'feelslike': day.feelslike,
            'temp': day.temp,
            'tempmin': day.tempmin,
            'tempmax': day.tempmax,
            'windspeed': day.windspeed,
            'humidity': day.humidity,
            'icon': day.icon,
            'isSelected': false
        })
    }
    weatherData.weatherToday.resolvedAddress = responseJson.resolvedAddress
    return weatherData
}

const submitButton = document.querySelector("button")
submitButton.addEventListener('click', event => {
    const form = document.querySelector('form')

    if(form.checkValidity()) {
        event.preventDefault()
        const weatherSearchBar = document.querySelector("#weather-search")
        const startDate = document.querySelector("#start-date")
        const endDate = document.querySelector("#end-date")

        getWeatherData(weatherSearchBar.value, startDate.value, endDate.value)
        .then(weatherData => {
            renderWeatherCards(weatherData)
            renderWeatherToday(weatherData)
        })
        .catch(error => alert('Oops! Something went wrong..'))
    }
})

let selectedWeatherDay = null
let selectedWeatherCard = null

function renderWeatherCards(weatherData) {
    const content = document.querySelector('.content')
    content.textContent = ''
    for(const weatherDay of weatherData.weatherDays) {
        const weatherCard = document.createElement('div')
        weatherCard.classList.add('weather-card')
        weatherCard.addEventListener('click', event => {
            // Nothing selected, click on a new card
            if(selectedWeatherDay === null) {
                selectedWeatherCard = weatherCard
                selectedWeatherCard.classList.add('selected-card')
                selectedWeatherDay = weatherDay
                openSidebar(weatherDay)
            }
            // Click selected card
            else if(selectedWeatherDay === weatherDay) {
                selectedWeatherDay = null
                selectedWeatherCard.classList.remove('selected-card')
                selectedWeatherCard = null
                closeSidebar()
            } 
            // Something selected, click on another card
            else {
                selectedWeatherCard.classList.remove('selected-card')
                selectedWeatherCard = weatherCard
                selectedWeatherCard.classList.add('selected-card')
                selectedWeatherDay = weatherDay
                openSidebar(weatherDay)
            }
        })
        content.appendChild(weatherCard)

        const cardHeader = document.createElement('div')
        cardHeader.classList.add('card-header')
        weatherCard.appendChild(cardHeader)

        const datetime = document.createElement('div')
        datetime.classList.add('datetime')
        datetime.textContent = weatherDay.datetime
        cardHeader.appendChild(datetime)

        const condition = document.createElement('div')
        condition.classList.add('condition')
        condition.textContent = weatherDay.conditions
        cardHeader.appendChild(condition)

        const icon = document.createElement('img')
        icon.classList.add('icon')
        icon.src = `icons/${weatherDay.icon}.png`
        cardHeader.appendChild(icon)

        const cardBody = document.createElement('div')
        cardBody.classList.add('card-body')
        weatherCard.appendChild(cardBody)

        const minTemp = document.createElement('div')
        minTemp.classList.add('min-temp')
        minTemp.textContent = `Min: ${weatherDay.tempmin}`
        cardBody.appendChild(minTemp)

        const maxTemp = document.createElement('div')
        maxTemp.classList.add('max-temp')
        maxTemp.textContent = `Max: ${weatherDay.tempmax}`
        cardBody.appendChild(maxTemp)
    }
}

function openSidebar(weatherDay) {
    const container = document.querySelector('.container')
    container.style.marginRight = '250px'
    const sidebar = document.querySelector('.sidebar')
    sidebar.textContent = ''
    sidebar.style.width = '250px'
    sidebar.style.padding = '20px'

    const datetime = document.createElement('div')
    datetime.classList.add('sidebar-item')
    datetime.textContent = `Datetime: ${weatherDay.datetime}`
    sidebar.appendChild(datetime)

    const conditions = document.createElement('div')
    conditions.classList.add('sidebar-item')
    conditions.textContent = `Condition: ${weatherDay.conditions}`
    sidebar.appendChild(conditions)
    
    const description = document.createElement('div')
    description.classList.add('sidebar-item')
    description.textContent = `Description: ${weatherDay.description}`
    sidebar.appendChild(description)

    const feelslike = document.createElement('div')
    feelslike.classList.add('sidebar-item')
    feelslike.textContent = `Feels like: ${weatherDay.feelslike}`
    sidebar.appendChild(feelslike)

    const temp = document.createElement('div')
    temp.classList.add('sidebar-item')
    temp.textContent = `Temp: ${weatherDay.temp}`
    sidebar.appendChild(temp)

    const tempmin = document.createElement('div')
    tempmin.classList.add('sidebar-item')
    tempmin.textContent = `Min temp: ${weatherDay.tempmin}`
    sidebar.appendChild(tempmin)

    const tempmax = document.createElement('div')
    tempmax.classList.add('sidebar-item')
    tempmax.textContent = `Max temp: ${weatherDay.tempmax}`
    sidebar.appendChild(tempmax)

    const windspeed = document.createElement('div')
    windspeed.classList.add('sidebar-item')
    windspeed.textContent = `Wind speed: ${weatherDay.windspeed}`
    sidebar.appendChild(windspeed)

    const humidity = document.createElement('div')
    humidity.classList.add('sidebar-item')
    humidity.textContent = `Humidity: ${weatherDay.humidity}`
    sidebar.appendChild(humidity)
}

function closeSidebar() {
    document.querySelector('.container').style.marginRight = '0px'
    document.querySelector('.sidebar').style.width = '0px'
    document.querySelector('.sidebar').style.padding = '0px'
}

function renderWeatherToday(weatherData) {
    const weatherToday = document.querySelector('.weather-today')
    weatherToday.textContent = ''

    const location = document.createElement('div')
    location.classList.add('title')
    location.textContent = `${weatherData.weatherToday.resolvedAddress}`
    weatherToday.appendChild(location)
}

getWeatherData('london,uk').then(weatherData => {
    renderWeatherCards(weatherData)
    renderWeatherToday(weatherData)
})

// TODO button to toggle between temp units
// TODO loading time display
// TODO card color?