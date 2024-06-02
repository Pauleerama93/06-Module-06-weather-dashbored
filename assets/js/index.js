let searchHistoryForWeather= [];
const weatherAPIBaseURL = "https://api.openweathermap.org";
const weatherAPIKey = "4fe3d3b024d404c3b18ecaabe58ca285";

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const todayContainer = document.querySelector("#today");
const forecastContainer = document.querySelector("#forecast");
const weatherHistoryContainer = document.querySelector("#weather-history");

const createSearchHistory = () => {
    weatherHistoryContainer.innerHTML = "";
    for(let index = 0; index < searchHistoryForWeather.length; index++) {
        const buttonElement = document.createElement("button");
        buttonElement.setAttribute("id", "city-button");
        buttonElement.setAttribute("type", "button");
        buttonElement.setAttribute("class", "btn btn-secondary");
        buttonElement.setAttribute("aria-controls", "today forecast");
        buttonElement.classList.add("history-button")
        buttonElement.setAttribute("data-search", searchHistoryForWeather[index]);
        buttonElement.textContent = searchHistoryForWeather[index];
        weatherHistoryContainer.append(buttonElement);
    }
}
const appendWeatherHistory = (search) => {
    if(searchHistoryForWeather.indexOf(search) !== -1) {
        return;
    }
    searchHistoryForWeather.push(search);
    localStorage.setItem("weatherHistory", JSON.stringify(searchHistoryForWeather));
    createSearchHistory();
}


const fetchCoordinates = (search) => {
    //break down of fetching
    //URL(base) ---> endpoint ; Parameters --> query string ; fetch -> GET : 
    // Full URL: http://api.openweathermap.org/geo/1.0/direct?q={cityName},{stateCode},{countryCode}&limit={limit}&appid={APIKey}
    //Base URL(ref line 2) --> http://api.openweathermap.org
    //endpoint --> /geo/1.0/direct
    //query string --> ?q={city name},
    // {state code},{country code}
    // &limit={limit}
    // &appid={API key}
    const url = `${weatherAPIBaseURL}/geo/1.0/direct?q=${search}&appid=${weatherAPIKey}`;
    // To test what we are getting back: console.log(url);
    //fetch -> GET
    fetch(url)
    //getting the fetch to actaully pull the information and return in readable data(JSON)
    .then(function(response) {
        return response.json();
    }).then(function(data){
        // log the data to see how to fetch the right things
        console.log(data);
        //log search to see what we are getting 
        console.log(search);
        // ref the log to see how to fetch the longitude and the latitude 
        const latitude = data[0].lat;
        const longitude = data[0].lon;
        //Check the data
        console.log(latitude, longitude);
        //If there is no city then Alert, but if there is store in weather history
        if(!data[0]){
            alert("City not found");
        } else {
            appendWeatherHistory(search);
            fetchWeather(data[0])
        } 
        //Putting a safe guard in 
    }).catch(function(error){
        console.log(error);
    });
    
}
const displayCurrentWeather = (city, weatherData) => {
    const date = dayjs().format("M/D/YYYY");
    const tempF = weatherData.main.temp;
    const windMph = weatherData.wind.speed;
    const humidity = weatherData.main.humidity;
    const iconUrl = `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
    const iconDescription =  weatherData.weather[0].description || "No Description";
     //logging to see if my data is coming back
    console.log(weatherData);
    console.log(date, tempF);
    console.log(iconUrl);
    console.log(humidity);
    //making a card
    
    const card = document.createElement("div");
    const cardBody = document.createElement("div");
    const heading = document.createElement("h3");
    const weatherIcon = document.createElement("img");
    const temperatureElement = document.createElement("p");
    const windElement = document.createElement("p");
    const humidityElement = document.createElement("p");

    card.setAttribute("class", "card bg-light mb-3");
    cardBody.setAttribute("class", "card-body");
    card.append(cardBody);

    heading.setAttribute("class", "h3 card-title");
    temperatureElement.setAttribute("class", "card-text");
    windElement.setAttribute("class", "card-text");
    humidityElement.setAttribute("class", "card-text");

    heading.textContent = `${city} (${date})`;
    weatherIcon.setAttribute("src", iconUrl);
    weatherIcon.setAttribute("alt", iconDescription);
    heading.append(weatherIcon);
    temperatureElement.textContent = `Temperature 🌡️: ${tempF} °F`;
    humidityElement.textContent = `Humidity 🌧️: ${humidity} %`
    windElement.textContent = `Wind 🪁: ${windMph} MPH`;
    cardBody.append(heading, temperatureElement, humidityElement, windElement);

    todayContainer.innerHTML = "";
    todayContainer.append(card);
}

const createForecastCard = (forecastData) => {
    const iconUrl = `http://openweathermap.org/img/w/${forecastData.weather[0].icon}.png`;
    const iconDescription = forecastData.weather[0].description || "No description";
    const temperature = forecastData.main.temp;
    const wind = forecastData.wind.speed;
    const humidity = forecastData.main.humidity; 

    const column = document.createElement("div");
    const card = document.createElement("div");
    const cardBody = document.createElement("div");
    const cardTitle = document.createElement("h5");
    const weatherIcon = document.createElement("img");
    const temperatureElement = document.createElement("p");
    const windElement = document.createElement("p");
    const humidityElement = document.createElement("p");

    column.append(card);
    card.append(cardBody);
    cardBody.append(cardTitle, temperatureElement, windElement, humidityElement);

    column.setAttribute("class", "col-md");
    column.classList.add("five-day-card");
    card.setAttribute("class", "card bg-primary text-white");
    cardBody.setAttribute("class", "card-body");
    cardTitle.setAttribute("class", "card-title");
    temperatureElement.setAttribute("class", "card-text");
    windElement.setAttribute("class", "card-text");
    humidityElement.setAttribute("class", "card-text");

    cardTitle.textContent = dayjs(forecastData.dt_txt).format("M/D/YYYY");
    weatherIcon.setAttribute("src", iconUrl);
    weatherIcon.setAttribute("alt", iconDescription);
    temperatureElement.textContent = `Temp 🌡️: ${temperature} °F`;
    windElement.textContent = `Wind 🪁: ${wind} MPH`;
    humidityElement.textContent = `Humidity 🌧️: ${humidity} %`

    forecastContainer.append(column);
}


const displayForecast = (weatherData) => {
    const startDate = dayjs().add(1, "day").startOf("day").unix();
    const endDate = dayjs().add(6, "day").startOf("day").unix();

    const headingColumn = document.createElement("div");
    const heading = document.createElement("h3");
    headingColumn.setAttribute("class", "col-12");
    heading.textContent = "5-Day Forecast:";
    headingColumn.append(heading);

    forecastContainer.innerHTML = "";
    forecastContainer.append(headingColumn);

    for(let index = 0; index < weatherData.length; index++){
        if(weatherData[index].dt >= startDate && weatherData[index].dt < endDate ){
            if(weatherData[index].dt_txt.slice(11,13) === "12"){
                createForecastCard(weatherData[index]);
            }
        }
    }
}


const fetchWeather = (location) => {
    const latitude = location.lat;
    const longitude = location.lon;

    const city = location.name;
//Engineering this link to fit: https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
//Already have the base(weatherAPIBaseURL): https://api.openweathermap.org
//query per: data/2.5/forecast?
//info I need to insert: at={lat}&lon={lon}&appid={API key} --> lat= "latitude" , lon="longitude" , API key= "weatherAPIKey"
    const apiURL = `${weatherAPIBaseURL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherAPIKey}`
    //Checking to see if the URL is set up correctly
    console.log(apiURL);
    //After checking to see if the URL is working I have to fetch
    fetch(apiURL).then(function(response){
        //converting the data to json
        return response.json();
    }).then(function(data){
        //logging data at this point to get the right info
        console.log(data)
        displayCurrentWeather(city, data.list[0])
        displayForecast(data.list);
    }).catch(function(error){
        console.log(error);
    });
}

const handleSearchFormSubmit = (event) => {
    event.preventDefault();

    const search = searchInput.value.trim();
    if(search){
        fetchCoordinates(search);
    }
    searchInput.value="";
}

const initializeSeachHistory = () => {
    const storedWeatherHistory = JSON.parse(localStorage.getItem("weatherHistory"))
    if(storedWeatherHistory){
        searchHistoryForWeather = storedWeatherHistory;
    }
    createSearchHistory();
}

const handleSearchHistoryClick = (event) => {
    console.log(event.target)
    if(!event.target.matches(".history-button")){
        return;
    }

    const buttonElement = event.target;

    const search = buttonElement.getAttribute("data-search")
    fetchCoordinates(search);
}


//Events
initializeSeachHistory()
//Ref line 5 
searchForm.addEventListener("submit", handleSearchFormSubmit);
weatherHistoryContainer.addEventListener("click", handleSearchHistoryClick);