const citySearchEl = document.getElementById("submit");
const searchedCities = document.getElementById("searched-cities");
const appId = "f642abd07680d52d301698bab489005d";

// for the day of the week
var d = new Date();

const searchArray = JSON.parse(localStorage.getItem("weatherSearch")) || [];
// takes local storage searches and puts them into an array to display and limit the amount of search item

// displays the local storage search history
displayLocalStorage = () => {
  if (searchedCities.firstChild) searchedCities.firstChild.remove();

  const searchedCitieslist = document.createElement("ul");
  searchedCitieslist.setAttribute("id", "searched-cities-list");
  searchedCities.appendChild(searchedCitieslist);

  if (searchArray.length > 0) {
    for (let i = 0; i < searchArray.length; i++) {
      const searchCity = searchArray[i];
      const searchLi = document.createElement("li");
      // searchLi.setAttribute("onclick", checkWeather(e.target.innerHTML));
      searchLi.classList.add("clickable");
      searchLi.innerHTML = searchCity;
      searchedCitieslist.appendChild(searchLi);
    }
    // end of for loop
  }
  // end of if

  searchedCitieslist.addEventListener("click", (event) => {
    if (event.target.classList.contains("clickable")) {
      checkWeather(event.target.innerHTML);
    }
  });
};
// end displayLocalStorage function

// tempColor adds a color class to an HTML element to change its color based on weather condition
// expects num = the temp or uv index in a number, the id of the element to change, and wether it is uv or temp
weathColor = (num, id, type) => {
  const element = document.getElementById(id);

  if (type === "temp") {
    if (num < 50) element.classList.add("blue");
    if (num > 50 && num < 70) element.classList.add("yellow");
    if (num > 70 && num < 85) element.classList.add("orange");
    if (num > 85) element.classList.add("red");
  } else if (type === "uv") {
    if (num <= 3) uv.classList.add("green");
    if (num > 3 && num <= 6) uv.classList.add("yellow");
    if (num > 6 && num <= 8) uv.classList.add("orange");
    if (num > 8) uv.classList.add("red");
  }
};
// end of weathColor function

cityClickHandler = (event) => {
  event.preventDefault();
  const cityName = document.getElementById("citySearch");

  if (cityName.value === "") {
    if ((searchArray.length = 0)) city = searchArray[0];
  } else {
    city = cityName.value;
  }
  checkWeather(city);
  cityName.value = "";
  // end of if
};
// end cityClickHandler

getLocation = () => {
  console.log("attempting to get location");
  navigator.geolocation.getCurrentPosition(autoCheck);
};

autoCheck = (position) => {
  const requestUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit={limit}&appid={API key}`;
  fetch(requestUrl)
    .then((response) => response.json())
    .then((data) => {});
  console.log(
    "Latitude: " +
      position.coords.latitude +
      "Longitude: " +
      position.coords.longitude
  );
};

checkWeather = (checkCity) => {
  const tempEl = document.getElementById("temp");
  const humidityEl = document.getElementById("humidity");
  const wind = document.getElementById("wind");
  var requestUrl;

  if (typeof checkCity === "object" && checkCity !== null) {
    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${checkCity}&units=imperial&appid=${appId}`;
    console.log("checkCity is object");
  } else {
    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${checkCity}&units=imperial&appid=${appId}`;
    console.log("checkCity is not object");
    console.log("checkCity is " + checkCity);
  }

  fetch(requestUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const {
        weather,
        name,
        coord: { lat },
        coord: { lon },
        main: { temp },
        main: { humidity },
        wind: { speed },
      } = data;
      const cityNameEl = document.getElementById("city-name");
      cityNameEl.innerHTML = `${name}  Today`;
      tempEl.innerHTML = temp;
      weathColor(temp, "temp", "temp");
      humidityEl.innerHTML = humidity;
      wind.innerHTML = speed;
      uvRequest(lat, lon);

      const todaysCondition = document.getElementById("todays-condition");
      todaysCondition.setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${weather[0].icon}@4x.png`
      );
      todaysCondition.setAttribute("aria", weather[0].description);

      if (name !== searchArray[0]) {
        searchArray.unshift(name);

        while (searchArray.length > 10) {
          searchArray.pop();
        }
        localStorage.setItem("weatherSearch", JSON.stringify(searchArray));
        displayLocalStorage();
      }
    });
  // end of fetch .then .then
};
// end of checkWeather function

uvRequest = (lat, lon) => {
  const uvRequestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${appId}`;
  // exclude=minutely,hourly,alerts&
  fetch(uvRequestUrl)
    .then((blob) => blob.json())
    .then((data) => {
      console.log(data);
      const uv = document.getElementById("uv");
      const {
        current: { uvi },
        daily,
      } = data;

      uv.innerHTML = uvi;
      // changes the color of the uv result depending on its severity
      weathColor(uvi, "uv", "uv");

      getFiveDay(daily);
    });
  // end second .then
};
// end of uvRequest function

const getFiveDay = (daily) => {
  for (let i = 1; i < 6; i++) {
    const { weather, temp, humidity } = daily[i];

    const fiveDateEl = document.getElementById(`day${i}-date`);
    d.setDate(d.getDate() + 1);
    const day = d.toLocaleDateString("en-US", { weekday: "long" });
    fiveDateEl.innerHTML = day;

    const fiveConditionEl = document.getElementById(`day${i}-condition`);

    fiveConditionEl.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`
    );
    fiveConditionEl.setAttribute("aria", weather[0].description);

    const fiveTempEl = document.getElementById(`day${i}-temp`);
    const fiveTemp =
      Math.round((temp.min + temp.max / 2 + Number.EPSILON) * 100) / 100;
    fiveTempEl.innerHTML = fiveTemp;
    weathColor(fiveTemp, `day${i}-temp`, "temp");

    const fiveHumidityEl = document.getElementById(`day${i}-humidity`);
    fiveHumidityEl.innerHTML = humidity;
  }
  // end for loop
};
// end getFiveDay function

init = () => {
  // getLocation();
  displayLocalStorage();
  if (searchArray.length > 0) checkWeather(searchArray[0]);
};
init();
citySearchEl.addEventListener("click", cityClickHandler);
