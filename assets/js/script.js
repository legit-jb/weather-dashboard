
// fetch request gets a list of all the repos for the node.js organization

var citySearchEl = document.querySelector("#submit");
var cityName = document.querySelector('#citySearch');

var cityClickHandler = function (event) {
    event.preventDefault()
    var temp = document.querySelector("#temp");
    var humidity = document.querySelector("#humidity");
    var wind = document.querySelector("#wind");
    var uv = document.querySelector("#uv");
    var city = cityName.value;
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid=f642abd07680d52d301698bab489005d";
 
    fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      
      temp.textContent = data.main.temp;
        // humidity.value = data.main.


    });
}

citySearchEl.addEventListener('click', cityClickHandler);