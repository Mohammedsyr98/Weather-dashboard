let apiKey = "df65ee5c709efd42eaa8e95e7bc26693";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&exclude=hourly,daily&units=metric&q=`;
let dayNames = [
  "Sunday",
  `Monday`,
  `Tuesday`,
  `Wednesday`,
  `Thursday`,
  `Friday`,
  `Saturday`,
];
let monthNames = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`,
];
let weatherPhoto = {
  Clouds: `images/clouds.png`,
  Drizzle: `images/drizzle.png`,
  Mist: `images/mist.png`,
  Rain: `images/rain.png`,
  Clear: `images/sunny-icon.png`,
};
let intervalId = null;

async function fetchWeather(cityName) {
  let response = await fetch(apiUrl + cityName);
  let data = await response.json();

  return data;
}
let lat;
let lon;
function fetchWeatherData(cityName) {
  fetchWeather(cityName)
    .then((data) => {
      // get more days weather from api
      lat = data.coord.lat;
      lon = data.coord.lon;
      // Current time function
      function currentTime() {
        let cityName = document.querySelector(".city-name");
        let currentDateSpan = document.querySelector(".time-box .date");
        currentTime = new Date(data.dt * 1000);
        // Current date variables
        let currentDay = dayNames[currentTime.getDay()];
        let currentMonth = monthNames[currentTime.getMonth()];
        cityName.textContent = data.name;
        currentDateSpan.textContent =
          currentDay + "," + currentTime.getDate() + " " + currentMonth;
      }
      currentTime();
      // Current weather function
      function currentWeather() {
        let WeatherPhoto = document.querySelector(".col-two img");
        WeatherPhoto.setAttribute("src", weatherPhoto[data.weather[0].main]);
        let currentWeatherSpan = document.querySelector(
          ".current-weather .temp"
        );
        let feelsLikeSpan = document.querySelector(
          ".current-weather .feels-like"
        );
        let sunriceSpan = document.querySelector(".sunrice .date");
        let sunsetSpan = document.querySelector(".sunset .date");
        let weatherTypeSpan = document.querySelector(
          ".current-weather .weather-type"
        );
        let windSpeedSpan = document.querySelector(
          ".current-weather .wind .ration"
        );
        let humiditySpan = document.querySelector(
          ".current-weather .humidity .ration"
        );
        let pressureSpan = document.querySelector(
          ".current-weather .pressure .ration"
        );

        // current temp and sunset sunrise variables
        let currentWeather = Math.floor(data.main.temp);
        let feelsLikeTemp = Math.floor(data.main.feels_like);
        let sunriceTime = new Date(data.sys.sunrise * 1000);
        let sunsetTime = new Date(data.sys.sunset * 1000);
        let windSpeed = Math.floor(data.wind.speed * 3.6);
        let humidity = data.main.humidity;
        let pressure = data.main.pressure;
        let weatherDescription = data.weather[0].main;
        currentWeatherSpan.textContent = currentWeather + "°C";
        weatherTypeSpan.textContent = weatherDescription;
        feelsLikeSpan.textContent = "Feels Like " + feelsLikeTemp + "°C";
        sunriceSpan.textContent =
          sunriceTime.getHours() +
          ":" +
          sunriceTime.toString().slice(16, 18) +
          " AM";
        sunsetSpan.textContent =
          sunsetTime.getHours() +
          ":" +
          sunsetTime.toString().slice(16, 18) +
          " PM";
        windSpeedSpan.textContent = windSpeed + " KM/H";
        humiditySpan.textContent = humidity + " %";
        pressureSpan.textContent = pressure + " hPa";
      }
      // start fetch api for uv index
      var myHeaders = new Headers();
      myHeaders.append("x-access-token", "openuv-bzd368rltfywxlc-io");
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        `https://api.openuv.io/api/v1/forecast?lat=${lat}&lng=${lon}&alt=100&dt=`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          let uvIndexSpan = document.querySelector(
            ".current-weather .uv .ration"
          );
          // insert current uv index to page
          uvIndexSpan.textContent = result.result[9].uv;
        })
        .catch((error) => console.log("error", error));

      currentWeather();
      fetchWeather(cityName).then((data) => console.log(data));
      console.log(data);
      return fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&exclude=hourly&units=metric`
      );
    })
    .then((res) => res.json())
    .then((data) => {
      // daily Forecast function
      function dailyForecast() {
        // i for day index in data.list
        let i = 7;
        let dayilyForecastBox = document.querySelectorAll(
          ".daily-forecast div"
        );
        Array.from(dayilyForecastBox).forEach((dayBox) => {
          // set weather information for days
          let date = new Date(data.list[i].dt * 1000);
          let Day = dayNames[date.getDay()];
          let Month = monthNames[date.getMonth()];

          Array.from(dayBox.children).forEach((ele, index) => {
            // image weather in day
            index == 0
              ? ele.setAttribute(
                  "src",
                  weatherPhoto[data.list[i].weather[0].main]
                )
              : "";
            // temp in day
            index == 1 ? (ele.textContent = data.list[i].weather[0].main) : "";
            // dare in this day
            index == 2
              ? (ele.textContent = `${Day} ${date.getDate()} ${Month}`)
              : "";
          });

          i += 8;
        });
      }
      dailyForecast();

      //hourly forecast function
      let hourlyForecatBox = document.querySelectorAll(".hourly-forecast div");
      let i = 4;
      Array.from(hourlyForecatBox)
        .slice(1)
        .forEach((ele, index) => {
          i++;
          Array.from(ele.children).forEach((ele, index) => {
            // set time for tomorrow day
            index == 0
              ? (ele.textContent = data.list[i].dt_txt
                  .split(" ")[1]
                  .slice(0, 5))
              : "";
            // set photo for weather in tomorrow day
            index == 1
              ? ele.setAttribute(
                  "src",
                  weatherPhoto[data.list[i].weather[0].main]
                )
              : "";

            //set temp for weather in tomorrow day
            index == 2
              ? (ele.textContent = Math.floor(data.list[i].main.temp) + "°C")
              : "";
            // set wind speed for weather in tomorrow day

            index == 4
              ? (ele.textContent =
                  Math.floor(data.list[i].wind.speed * 3.6) + " KM/H")
              : "";
          });
        });
      return data;
    })
    .then((data) => {
      let lat = data.city.coord.lat;
      let lon = data.city.coord.lon;
      // real time from api
      async function getTimeFromAPI() {
        let data;
        try {
          let response = await fetch(
            `https://api.api-ninjas.com/v1/worldtime?lat=${lat}&lon=${lon}&X-Api-Key=aRS/m5zttsjGot22zA5azg==bdGjDevOMZZmDu8Y`
          );

          let data = await response.json();
          console.log(parseInt(data.minute));
          currentTime = {
            hour: parseInt(data.hour),
            minute: parseInt(data.minute),
            second: parseInt(data.second),
          };
        } catch (error) {
          console.log(error);
        }
      }
      // update time after called from api
      function updateTimeManually() {
        currentTime.second++;
        if (currentTime.second === 60) {
          currentTime.second = 0;
          currentTime.minute++;
        }
        if (currentTime.minute === 60) {
          currentTime.minute = 0;
          currentTime.hour++;
        }
        if (currentTime.hour === 24) {
          currentTime.hour = 0;
        }

        currentTimeSpan.textContent = ` ${currentTime.hour}:${
          currentTime.minute < 10
            ? "0" + currentTime.minute
            : currentTime.minute
        }:${
          currentTime.second < 10
            ? "0" + currentTime.second
            : currentTime.second
        }`;
      }

      intervalId = setInterval(updateTimeManually, 1000);
      getTimeFromAPI()
        .then(updateTimeManually)
        .catch((error) =>
          console.error("Failed to fetch time from API:", error)
        );
    })
    // if city found and all status are ok
    .then(() => animationBoxes())
    // if city not found
    .catch(() => animationCityNotFound());
}

let currentTime = { hour: 0, minute: 0, second: 0 };
let currentTimeSpan = document.querySelector(".time");
let searchButton = document.querySelector(".search");
let inputData = document.querySelector(".input-data");
let currentLocation = document.querySelector(".current-location");
// when the user clicked on search button
searchButton.addEventListener("click", function () {
  if (inputData.value != "") {
    clearInterval(intervalId);
    // start fetch
    fetchWeatherData(inputData.value);
  }
});
// get lat and lon with click

currentLocation.addEventListener("click", () =>
  navigator.geolocation.getCurrentPosition(success)
);
// fetch city name with lat and lon after click

function success(pos) {
  // clearInterval is for current time
  clearInterval(intervalId);
  currentTime = { hour: 0, minute: 0, second: 0 };
  const crd = pos.coords;
  // get city name from the latitude and longitude
  async function getCityName() {
    let lat = crd.latitude;
    let lon = crd.longitude;
    let response = await fetch(
      `https://geocode.search.hereapi.com/v1/revgeocode?at=${lat},${lon}&apiKey=al8wC_SQeq8-KOAXt0jCUJozBJSifbw3GW21f9NxBL4`
    );
    let data = response.json();
    return data;
  }
  // fetch weather with city name
  getCityName().then((data) => fetchWeatherData(data.items[0].address.county));
  getCityName();
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}
// animation boxs start when the city is found and status are ok
function animationBoxes() {
  let headerBox = document.querySelector(".header");
  let timeBox = document.querySelector(".time-box");
  let currentWeatherBox = document.querySelector(".current-weather");
  let dailyForecastBox = document.querySelector(".daily-forecast");
  let hourlyForecatBox = document.querySelector(".hourly-forecast");
  let cityNotFound = document.querySelector(".city-not-found");
  if (cityNotFound.classList.contains("city-not-found-animation")) {
    cityNotFound.classList.remove("city-not-found-animation");
  }
  headerBox.classList.add("header-animation");
  timeBox.classList.add("time-box-animation");
  currentWeatherBox.classList.add("current-weather-animation");
  dailyForecastBox.classList.add("daily-forecast-animation");
  hourlyForecatBox.classList.add("hourly-forecast-animation");
}
// if the city is not found
function animationCityNotFound() {
  let headerBox = document.querySelector(".header");
  headerBox.classList.add("header-animation");
  let cityNotFound = document.querySelector(".city-not-found");
  cityNotFound.classList.add("city-not-found-animation");
}
// for enter key press
inputData.addEventListener("keypress", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    if (inputData.value.trim() !== "") {
      clearInterval(intervalId);
      fetchWeatherData(inputData.value.trim());
    }
  }
});
