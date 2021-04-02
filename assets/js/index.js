const citySearchEl = document.querySelector("#submit");
const cityName = document.querySelector('#citySearch');
const appId = "f642abd07680d52d301698bab489005d";

cityClickHandler = (event) => {
    event.preventDefault()
    const tempEl = document.querySelector("#temp");
    const humidityEl = document.querySelector("#humidity");
    const wind = document.querySelector("#wind");
    


    const city = cityName.value;
    // TODO use a different api to get the longitude and latitude
    const requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${appId}`;

    fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
            const { name, coord: { lat }, coord: { lon }, main: { temp }, main: { humidity }, wind: { speed } } = data;
            const cityNameEl = document.getElementById("city-name");
            cityNameEl.innerHTML = name;
            tempEl.innerHTML = temp;
            humidityEl.innerHTML = humidity;
            wind.innerHTML = speed;
            uvRequest(lat, lon);
        });
}

uvRequest = (lat, lon) => {
    const uvRequestUrl =`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${appId}`;
    // exclude=minutely,hourly,alerts&
    fetch(uvRequestUrl)
        .then (blob => blob.json())
        .then(data => {
            const uv = document.querySelector("#uv");
            console.log (data);
            const {current :{uvi}, daily} = data;
            uv.innerHTML = uvi;
            getFiveDay (daily);
        });
        
}

const getFiveDay =(daily) => {
    const dateObj = dayjs();
    
    for (let i = 1; i < 6; i++) {
        const {weather, temp, humidity} = daily[i];

        const fiveDateEl = document.getElementById(`day${i}-date`);
        const day = dateObj.add(`${i}`,"day");
        fiveDateEl.innerHTML = day.format("M/D/YYYY");

        const fiveConditionEl = document.getElementById (`day${i}-condition`);
        fiveConditionEl.innerHTML = weather.icon;
        console.log ("weather" + weather.json);

        const fiveTempEl = document.getElementById ("day"+i+"-temp");
        fiveTempEl.innerHTML = Math.round(((temp.min + temp.max / 2) + Number.EPSILON) * 100) / 100;

        const fiveHumidityEl = document.getElementById (`day${i}-humidity`);
        fiveHumidityEl.innerHTML = humidity;
    }
    // .add(dayjs.duration({'days' : 1}));

}
citySearchEl.addEventListener('click', cityClickHandler);