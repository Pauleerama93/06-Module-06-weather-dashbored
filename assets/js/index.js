// Array to store search history
let searchHistoryForWeather= [];
// Base URL for the OpenWeather API
const weatherAPIBaseURL = "https://api.openweathermap.org";
// Your unique API key for the OpenWeather API
const weatherAPIKey = "4fe3d3b024d404c3b18ecaabe58ca285";

// Selecting HTML elements to interact with
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const todayContainer = document.querySelector("#today");
const forecastContainer = document.querySelector("#forecast");
const weatherHistoryContainer = document.querySelector("#weather-history");

// Function to create search history buttons dynamically
const createSearchHistory = () => {
     // Clear the container before adding new buttons
    weatherHistoryContainer.innerHTML = "";
     // Loop through the search history array and create buttons for each city
    for(let index = 0; index < searchHistoryForWeather.length; index++) {
        const buttonElement = document.createElement("button");
        buttonElement.setAttribute("id", "city-button");
        buttonElement.setAttribute("type", "button");
        buttonElement.setAttribute("class", "btn btn-secondary bg-primary");
        buttonElement.setAttribute("aria-controls", "today forecast");
        buttonElement.classList.add("history-button")
        buttonElement.setAttribute("data-search", searchHistoryForWeather[index]);
        buttonElement.textContent = searchHistoryForWeather[index];
        weatherHistoryContainer.append(buttonElement);
    }
}
// Function to append a new city to the search history
const appendWeatherHistory = (search) => {
    // Check if the city is already in the search history
    if(searchHistoryForWeather.indexOf(search) !== -1) {
        return;
    }
    // Add the new city to the search history array
    searchHistoryForWeather.push(search);
    // Save the updated search history to localStorage
    localStorage.setItem("weatherHistory", JSON.stringify(searchHistoryForWeather));
    // Re-create the search history buttons
    createSearchHistory();
}

// Function to fetch the geographical coordinates (latitude and longitude) for a city
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
            // Append the city to search history and fetch weather data
            appendWeatherHistory(search);
            fetchWeather(data[0])
        } 
        //Putting a safe guard in 
    }).catch(function(error){
        console.log(error);
    });
    
}
// Function to display the current weather for a city
const displayCurrentWeather = (city, weatherData) => {
     // Format the current date
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
 
     // Create HTML elements to display the weather data   
    const card = document.createElement("div");
    const cardBody = document.createElement("div");
    const heading = document.createElement("h3");
    const weatherIcon = document.createElement("img");
    const temperatureElement = document.createElement("p");
    const windElement = document.createElement("p");
    const humidityElement = document.createElement("p");

    // Set attributes and content for the elements
    card.setAttribute("class", "card bg-primary text-light mb-3");
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

    // Clear the container and append the new weather card
    todayContainer.innerHTML = "";
    todayContainer.append(card);
}
// Function to create a forecast card for a specific day
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

    // Set attributes and content for the elements
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

    // Append the forecast card to the forecast container
    forecastContainer.append(column);
}

// Function to display the 5-day weather forecast
const displayForecast = (weatherData) => {
    // Calculate the start and end dates for the forecast
    const startDate = dayjs().add(1, "day").startOf("day").unix();
    const endDate = dayjs().add(6, "day").startOf("day").unix();

    // Create and append the heading for the forecast
    const headingColumn = document.createElement("div");
    const heading = document.createElement("h3");
    headingColumn.setAttribute("class", "col-12");
    heading.textContent = "5-Day Forecast:";
    headingColumn.append(heading);

    forecastContainer.innerHTML = "";
    forecastContainer.append(headingColumn);
    // Loop through the weather data and create forecast cards for each day
    for(let index = 0; index < weatherData.length; index++){
        if(weatherData[index].dt >= startDate && weatherData[index].dt < endDate ){
            if(weatherData[index].dt_txt.slice(11,13) === "12"){
                createForecastCard(weatherData[index]);
            }
        }
    }
}

// Function to fetch the weather data for a specific location
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
        // Display the current weather and the forecast
        displayCurrentWeather(city, data.list[0])
        displayForecast(data.list);
    }).catch(function(error){
        console.log(error);
    });
}

// Function to handle the search form submission
const handleSearchFormSubmit = (event) => {
    event.preventDefault();

    const search = searchInput.value.trim();
    if(search){
        fetchCoordinates(search);
    }
    searchInput.value="";
}

// Function to initialize the search
const initializeSeachHistory = () => {
    const storedWeatherHistory = JSON.parse(localStorage.getItem("weatherHistory"))
    if(storedWeatherHistory){
        searchHistoryForWeather = storedWeatherHistory;
    }
    createSearchHistory();
}

// Function to handle clicks on the search history buttons
const handleSearchHistoryClick = (event) => {
    console.log(event.target)
    // If the clicked element is not a history button, exit the function
    if(!event.target.matches(".history-button")){
        return;
    }

    // Get the clicked button element
    const buttonElement = event.target;
    // Get the search term from the button's data attribute
    const search = buttonElement.getAttribute("data-search")
    // Fetch coordinates for the selected city
    fetchCoordinates(search);
}


// Initialize the search history when the page loads
initializeSeachHistory()
// Add an event listener to the search form for submitting new searches Ref line 5 
searchForm.addEventListener("submit", handleSearchFormSubmit);
// Add an event listener to the weather history container for handling clicks on history buttons
weatherHistoryContainer.addEventListener("click", handleSearchHistoryClick);