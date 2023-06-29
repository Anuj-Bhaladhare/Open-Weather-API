const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const UserContainer = document.querySelector(".weather-container");

const grantAcssesContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const LoadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let oldTab = userTab;
let API_KEY = "ede85f05763b4f4e017769ab774a5803";
oldTab.classList.add("current-tab");

getFromSessionStorage();

function switchTab(newTab) {
    if(newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")) {
         //kya search form wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active"); 
            grantAcssesContainer.classList.remove("active");
            searchForm.classList.ass("active");
        }
        else{
            //main pehle search wale tab pr tha, ab your weather tab visible karna h 
            searchForm.classList.remove("active");
            UserContainer.classList.remove("active");
            //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener('click', () => {
    //pass clicked tab as input paramter
    switchTab(userTab);
});

searchTab.addEventListener('click', () => {
    //pass clicked tab as input paramter
    switchTab(searchTab);
});


function getFromSessionStorage(){
    const localCordinates = sessionStorage.getItem("user-coordinates");

    if(!localCordinates) {
        //agar local coordinates nahi mile
        grantAcssesContainer.classList.add("active");
    }

    else{
        const coordinates = JSON.parse(localCordinates);
        fetchWetherInfo(coordinates);
    }
}

async function fetchWetherInfo(coordinates) {
    const{lat, lon} = coordinates;
    // make grantcontainer invisible
    grantAcssesContainer.classList.remove("active");
    //make loader visible
    LoadingScreen.classList.add("active");

    // API CALL

    try{
        const respomce = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        )
        const data = await respomce.json();

        LoadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        randamWetheeInfo(data);
    }
    catch(err){
        LoadingScreen.classList.remove("active");
    }
}



function randamWetheeInfo(weatherInfo) {
    //fistly, we have to fethc the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const tempreture = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudNess = document.querySelector("[data-cloudiness]");


    console.log(weatherInfo);

    //fetch values from weatherINfo object and put it UI elements

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    tempreture.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudNess.innerText = `${weatherInfo?.clouds?.all}%`;

}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    else{
        //HW - show an alert for no gelolocation support available
    }
}

function showPosition(position) {
    const userCordinats = {
        lat : position.coords.latitude,
        lan : position.coords.latitude,
    }

    sessionStorage.setItem("user-coordinats", JSON.stringify(userCordinats));
    fetchWetherInfo(userCordinats);
}


const grantAcsessButton = document.querySelector("[data-grantAccess]");
const searchInpute = document.querySelector("[data-searchInput]");

grantAcsessButton.addEventListener('click', getLocation);


searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let cityName = searchInpute.value;

    if(cityName === ""){
        return ;
    }
    else {
        fetchWetherInfo(cityName);
    }
})

async function fetchSearchWetherInfo(city) {
    LoadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAcssesContainer.classList.remove("active");

    try{
        const respomce = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        const data = await respomce.json();
        LoadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        randamWetheeInfo(data);
    }
    catch(err){
        // HW
    }
}