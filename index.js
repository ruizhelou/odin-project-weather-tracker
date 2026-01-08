async function getWeatherData(location, datetime1, datetime2) {
    let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}`
    if(datetime1 != null) {
        url += `/${datetime1}`
    }
    if(datetime2 != null) {
        url += `/${datetime2}`
    }
    url += `?key=9KK2HSQ9ZRJ2YRN6HNNMT9YTR&iconSet=icons2`

    const response = await fetch(url)
    const responseJson = await response.json()
    console.log(responseJson)

    const weatherData = {
        weatherForecast: [],
        weatherToday: { }
    }
    for(const day of responseJson.days) {
        weatherData.weatherForecast.push({
            'datetime': responseJson.days[0].datetime,
            'conditions': responseJson.days[0].conditions,
            'description': responseJson.days[0].description,
            'feelslike': responseJson.days[0].feelslike,
            'temp': responseJson.days[0].temp,
            'tempmin': responseJson.days[0].tempmin,
            'tempmax': responseJson.days[0].tempmax,
            'windspeed': responseJson.days[0].windspeed,
            'humidity': responseJson.days[0].humidity,
            'icon': responseJson.days[0].icon
        })
    }
    weatherData.weatherToday.icon = responseJson.currentConditions.icon
    weatherData.weatherToday.conditions = responseJson.currentConditions.conditions
    weatherData.weatherToday.temp = responseJson.currentConditions.temp
    weatherData.weatherToday.conditions = responseJson.currentConditions.conditions

    console.log(weatherData)
    return weatherData
}

