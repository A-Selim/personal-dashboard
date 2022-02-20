import { apiKeys } from "./config.js";
const mainEl = document.querySelector(".main");
const cryptoEl = document.getElementById("crypto");
const weatherEl = document.getElementById("weather");
const timeSection = document.querySelector(".time");
const bottomSection = document.querySelector(".bottom");

// Add background image
fetch(`https://api.unsplash.com/photos/random?client_id=${apiKeys.unsplash}&orientation=landscape&query=nature`)
    .then((res) => res.json())
    .then((data) => {
        // Set background image of main div
        mainEl.style.backgroundImage = `url(${data.urls.regular})`;
        // Get author name of the image
        const imageAuthor = data.user.name;
        // Get author profile of the image
        const imageAuthorProfile = data.user.username;
        // Get the location of the image
        let imageLocation = data.location.title;
        // Set location "Unknown" if there is no location in the image metadata
        if (!imageLocation) {
            imageLocation = "Unknown";
        }
        // Add author name & location to the bottom section of HTML
        bottomSection.innerHTML = `
            <p class="location">Location: ${imageLocation}</p>
            <p class="author">Photo by: <a href="https://unsplash.com/@${imageAuthorProfile}">${imageAuthor}</a></p>
        `;
    })
    .catch((err) => {
        document.body.style.backgroundImage = `url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDUwMzg5Mjk&ixlib=rb-1.2.1&q=80&w=1080")`;

        // Add author name & location to HTML
        bottomSection.innerHTML = `
            <p class="location">Location: North Shore, Waialua, United States</p>
            <p class="author">By: <a href="https://unsplash.com/@oulashin">Sean Oulashin</a></p>
        `;
    });

// Add time
function getTime() {
    const currentDate = new Date();
    const currentTime = currentDate.toLocaleTimeString("en-us", { hour: "2-digit", minute: "2-digit" });
    timeSection.innerHTML = `<p>${currentTime}</p>`;
}
// Get time update every 1 sec
setInterval(getTime, 1000);

// Get current location of user & Add weather
navigator.geolocation.getCurrentPosition((position) => {
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${apiKeys.openWeather}`
    )
        .then((res) => res.json())
        .then((data) => {
            weatherEl.innerHTML = `
            <img class="weather-icon" src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
            <span class="weather-temp">${Math.round(data.main.temp)}° C</span>
            <p class="city">${data.name}</p>
        `;
        });
});

// Add bitcoin data
fetch("https://api.coingecko.com/api/v3/coins/bitcoin")
    .then((res) => res.json())
    .then((data) => {
        // Add crypto image, name, current price, high and low price last 24 hours
        cryptoEl.innerHTML = `
            <img class="crypto-icon" src="${data.image.small}" />
            <span class="crypto-name">${data.name}</span>
            <div class="crypto-price">
                <p>👉 : $${data.market_data.current_price.usd}</p>
                <p>☝️ : $${data.market_data.high_24h.usd}</p>
                <p>👇 : $${data.market_data.low_24h.usd}</p>
            </div>
        `;
    });
