const API_KEY = "851d009604ababda0dd8ba22064925af"; // Replace with your OpenWeatherMap API key

async function getWeatherByCity() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Please enter a city name.");
  const res = await fetchWeather(city);
  if (res) updateUI(res);
}

function getWeatherByLocation() {
  navigator.geolocation.getCurrentPosition(async position => {
    const { latitude, longitude } = position.coords;
    const res = await fetchWeatherByCoords(latitude, longitude);
    if (res) updateUI(res);
  }, () => alert("Location access denied."));
}

async function fetchWeather(city) {
  try {
    const current = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`).then(r => r.json());
    const forecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`).then(r => r.json());
    return { current, forecast };
  } catch (e) {
    alert("Error fetching weather data.");
    return null;
  }
}

async function fetchWeatherByCoords(lat, lon) {
  try {
    const current = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`).then(r => r.json());
    const forecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`).then(r => r.json());
    return { current, forecast };
  } catch (e) {
    alert("Error fetching weather data.");
    return null;
  }
}

function updateUI({ current, forecast }) {
  const currentHTML = `
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-xl font-bold">${current.name} (${new Date().toISOString().slice(0, 10)})</h3>
        <p>Temperature: ${current.main.temp}°C</p>
        <p>Wind: ${current.wind.speed} M/S</p>
        <p>Humidity: ${current.main.humidity}%</p>
      </div>
      <div class="text-center">
        <img src="https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png" alt="weather icon" class="mx-auto"/>
        <p>${current.weather[0].main}</p>
      </div>
    </div>
  `;
  document.getElementById("currentWeather").innerHTML = currentHTML;

  const dailyForecasts = forecast.list.filter(f => f.dt_txt.includes("12:00:00"));
  const forecastHTML = dailyForecasts.slice(0, 5).map(f => `
    <div class="bg-gray-200 p-4 rounded text-center">
      <h4 class="font-semibold">(${f.dt_txt.split(" ")[0]})</h4>
      <img src="https://openweathermap.org/img/wn/${f.weather[0].icon}@2x.png" class="mx-auto" />
      <p>Temp: ${f.main.temp}°C</p>
      <p>Wind: ${f.wind.speed} M/S</p>
      <p>Humidity: ${f.main.humidity}%</p>
    </div>
  `).join("");

  document.getElementById("forecast").innerHTML = forecastHTML;
}
