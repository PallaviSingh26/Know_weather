
const weatherApi = {
    key: '4eb3703790b356562054106543b748b2',
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather'
};

const searchInputBox = document.getElementById('input-box');

searchInputBox.addEventListener('keypress', (event) => {
    if (event.keyCode === 13) {
        getWeatherReport(searchInputBox.value);
    }
});

function getWeatherReport(city) {
    fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
        .then(weather => weather.json())
        .then(showWeatherReport)
        .catch(() => {
            swal("Oops! 😔", "Something went wrong. Try again!", "error");
        });
}

function showWeatherReport(weather) {
    const city_code = weather.cod;

    if (city_code === '400') {
        swal("Empty Input", "Please enter a city 🏙️", "warning");
        reset();
    } else if (city_code === '404') {
        swal("Not Found ❌", "City not matched. Try again!", "error");
        reset();
    } else {
        const parent = document.getElementById('parent');
        const weatherBody = document.getElementById('weather-body');
        weatherBody.style.display = 'block';

        const todayDate = new Date();

        const emoji = getWeatherEmoji(weather.weather[0].main);
        const icon = `<i class="${getIconClass(weather.weather[0].main)}"></i>`;

        weatherBody.innerHTML = `
            <div class="location-deatils">
                <div class="city" id="city">${emoji} ${weather.name}, ${weather.sys.country}</div>
                <div class="date" id="date">${dateManage(todayDate)}</div>
            </div>

            <div class="weather-status">
                <div class="temp" id="temp">${Math.round(weather.main.temp)}°C</div>
                <div class="weather" id="weather">${weather.weather[0].main} ${icon}</div>
                <div class="min-max" id="min-max">
                    Min: ${Math.floor(weather.main.temp_min)}°C / Max: ${Math.ceil(weather.main.temp_max)}°C
                </div>
                <div id="updated_on">Updated at ${getTime(todayDate)}</div>
            </div>

            <hr>

            <div class="day-details">
                <div class="basic">
                    Feels like ${weather.main.feels_like}°C 💗 <br/>
                    Humidity: ${weather.main.humidity}% 💧<br/>
                    Pressure: ${weather.main.pressure} mb ⬇️<br/>
                    Wind: ${weather.wind.speed} KMPH 🌬️
                </div>
            </div>
        `;

        parent.append(weatherBody);
        changeBg(weather.weather[0].main);
        reset();
    }
}

function getTime(date) {
    let hour = addZero(date.getHours());
    let minute = addZero(date.getMinutes());
    return `${hour}:${minute}`;
}

function dateManage(dateArg) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];

    let day = days[dateArg.getDay()];
    let date = dateArg.getDate();
    let month = months[dateArg.getMonth()];
    let year = dateArg.getFullYear();

    return `${date} ${month} (${day}), ${year}`;
}

function changeBg(status) {
    const bgMap = {
        Clouds: 'clouds.jpg',
        Rain: 'rainy.jpg',
        Clear: 'clear.jpg',
        Snow: 'snow.jpg',
        Sunny: 'sunny.jpg',
        Thunderstorm: 'thunderstorm.jpg',
        Drizzle: 'drizzle.jpg',
        Mist: 'mist.jpg',
        Haze: 'mist.jpg',
        Fog: 'mist.jpg'
    };

    const bgImage = bgMap[status] || 'bg.jpg';
    document.body.style.backgroundImage = `url(img/${bgImage})`;
}

function getIconClass(condition) {
    switch (condition) {
        case 'Rain': return 'fas fa-cloud-showers-heavy';
        case 'Clouds': return 'fas fa-cloud';
        case 'Clear': return 'fas fa-sun';
        case 'Snow': return 'fas fa-snowflake';
        case 'Sunny': return 'fas fa-sun';
        case 'Mist': return 'fas fa-smog';
        case 'Thunderstorm': return 'fas fa-bolt';
        case 'Drizzle': return 'fas fa-cloud-rain';
        default: return 'fas fa-sun-cloud';
    }
}

function getWeatherEmoji(condition) {
    switch (condition.toLowerCase()) {
        case 'clouds': return '☁️';
        case 'rain': return '🌧️';
        case 'clear': return '☀️';
        case 'snow': return '❄️';
        case 'sunny': return '🌞';
        case 'drizzle': return '🌦️';
        case 'mist':
        case 'fog':
        case 'haze': return '🌫️';
        case 'thunderstorm': return '⛈️';
        default: return '🌈';
    }
}

function reset() {
    document.getElementById('input-box').value = '';
}

function addZero(num) {
    return num < 10 ? "0" + num : num;
}
