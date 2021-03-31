
// fetch request gets a list of all the repos for the node.js organization

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
            console.log (data);
            // const { coord: { lat }, coord: { lon }, main: { temp }, main: { humidity }, wind: { speed } } = data;
            // tempEl.innerHTML = temp;
            // humidityEl.innerHTML = humidity;
            // wind.innerHTML = speed;
            // uvRequest(lat, lon);
        });
}

uvRequest = (lat, lon) => {
    const uvRequestUrl =`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units-imperial&exclude=minutely,hourly,alerts&appid=${appId}`;
    // exclude=minutely,hourly,alerts&
    fetch(uvRequestUrl)
        .then (blob => blob.json())
        .then(data => {
            const uv = document.querySelector("#uv");
            console.log (data);
            const {current :{uvi}} = data;
            uv.innerHTML = uvi;
        });
}
citySearchEl.addEventListener('click', cityClickHandler);