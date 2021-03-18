
// fetch request gets a list of all the repos for the node.js organization

var citySearchEl = document.querySelector("#submit");
var cityName = document.querySelector('#citySearch');
const appId = "f642abd07680d52d301698bab489005d"

var cityClickHandler = function (event) {
    event.preventDefault()
    var temp = document.querySelector("#temp");
    var humidity = document.querySelector("#humidity");
    var wind = document.querySelector("#wind");
    var uv = document.querySelector("#uv");
    var city = cityName.value;
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + appId;


    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            temp.textContent = data.main.temp;
            humidity.value = data.main.humidity;
            wind.value = data.wind.speed;
            uvRequest(lat, lon);
        });
}

function uvRequest(lat, lon) {
    var uvRequestUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + appId;
    fetch(uvRequestUrl)
        .then(function (Data) {
            console.log("uvData:"+Data);
        });
}
citySearchEl.addEventListener('click', cityClickHandler);