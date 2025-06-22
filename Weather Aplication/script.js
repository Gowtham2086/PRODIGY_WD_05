function getWeather() {
  const apiKey = 'c74ceebbfbc1522e49bb6ad4af17c2c2'; // Use your own API key
  const city = document.getElementById('city').value.trim();

  if (!city) {
    alert('Please enter a city');
    return;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => {
      displayWeather(data);
    })
    .catch(error => {
      console.error('Error fetching current weather data:', error);
      alert('Error fetching current weather data. Please try again.');
    });

  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      displayHourlyForecast(data.list);
    })
    .catch(error => {
      console.error('Error fetching hourly forecast data:', error);
      alert('Error fetching hourly forecast data. Please try again.');
    });
}

function displayWeather(data) {
  const tempDivInfo = document.getElementById('temp-div');
  const weatherInfoDiv = document.getElementById('weather-info');
  const weatherIcon = document.getElementById('weather-icon');
  const hourlyForecastDiv = document.getElementById('hourly-forecast');

  tempDivInfo.innerHTML = '';
  weatherInfoDiv.innerHTML = '';
  hourlyForecastDiv.innerHTML = '';

  if (data.cod === '404') {
    weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    return;
  }

  const cityName = data.name;
  const temperature = Math.round(data.main.temp - 273.15);
  const description = data.weather[0].description;
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

  tempDivInfo.innerHTML = `<p>${temperature}°C</p>`;
  weatherInfoDiv.innerHTML = `<p>${cityName}</p><p>${description}</p>`;
  weatherIcon.src = iconUrl;
  weatherIcon.alt = description;
  weatherIcon.style.display = 'block';

  applyWeatherTheme(description);
}

function displayHourlyForecast(hourlyData) {
  const hourlyForecastDiv = document.getElementById('hourly-forecast');
  const next24Hours = hourlyData.slice(0, 8);

  hourlyForecastDiv.innerHTML = '';

  next24Hours.forEach(item => {
    const dateTime = new Date(item.dt * 1000);
    const hour = dateTime.getHours();
    const temperature = Math.round(item.main.temp - 273.15);
    const iconCode = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    const hourlyItemHtml = `
      <div class="hourly-item">
        <span>${hour}:00</span>
        <img src="${iconUrl}" alt="Hourly Weather Icon" />
        <span>${temperature}°C</span>
      </div>
    `;

    hourlyForecastDiv.innerHTML += hourlyItemHtml;
  });
}

function applyWeatherTheme(description) {
  const container = document.getElementById('weather-container');

  container.classList.remove('sunny', 'cloudy', 'rainy', 'snowy', 'stormy');

  const desc = description.toLowerCase();

  if (desc.includes('clear')) {
    container.classList.add('sunny');
  } else if (desc.includes('cloud')) {
    container.classList.add('cloudy');
  } else if (desc.includes('rain') || desc.includes('drizzle')) {
    container.classList.add('rainy');
  } else if (desc.includes('snow')) {
    container.classList.add('snowy');
  } else if (desc.includes('storm') || desc.includes('thunder')) {
    container.classList.add('stormy');
  }
}
