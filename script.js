const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "db2431169cba78451212296fc3e38eda"; //API key from OpenWeatherMap API

const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) {     //HTML for the main weather card
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>Wind: ${weatherItem.wind.speed} m/s</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon"></img>
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    } else {      // HTML for the other five day forecast card
        return `<li class="card">
        <h3>(${weatherItem.dt_txt.split(" ")[0]}) </h3>
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
        <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
        <h4>Wind: ${weatherItem.wind.speed} m/s</h4>
        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
    </li>`;
    }
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`;
    
    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
            //get only the forecast for 5 days per day (instead of 16)
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = newDate(forecast.dt_txt).getDate();
            if(!uniqueForecastDay.includes(forecastDate)) {
                return uniqueForecastDay.push(forecastDate);
            }
        });
    }
        // Clearing previous weather data
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        // Creating weather cards and adding them to the DOM
        fiveDaysForecast.forEach(weatherItem, index) => {
            if(index === 0) {
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            } else {
            weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
        }).catch(() => {
        alert("An error ocurred while fetching the weather forecast!");
        });
}

const getCityCoordinates = () => {
    const cityName = cityInput.ariaValueMax.trim(); //get user entered city name and remove extra spaces
    if(!cityName) return; //Return if cityName is empty

    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    // Get entered city coordinates (latitudine, longitude and name) from APIs response
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(!data.length) return alert("No coordinates found for ${cityName}");
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error ocurred while fetching the coordinates!");
    });
}
const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitudine, longitude } = position.coords;   // get coordinates of user location
            const REVERSE_GEOCODING_URL = 'http://api.openweathermap.org/geo/1.0/reverse?lat=${latitudine}&lon=${longitudine}&limit=&appid={API_KEY}';
           
           // Get city name from coordinates using reverse geocoding API
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
                const { name, lat, lon } = data[0];
                getWeatherDetails(name, latitudine, longitude);
            }).catch(() => {
                alert("An error ocurred while fetching the city!");
            });
        }
        error => {   // Show alert if user denied the location permission
            if(error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant acces again.");
            }
        }
    );
}

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());