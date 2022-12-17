"use strict";

// SETTING THECURRENT COLOR IN LOCAL STORAGE
const setLocalStorage = function (color) {
  localStorage.setItem("palette", color);
};

// Selecting elements
const widget = document.querySelector(".widget");
const widgetBlob = document.querySelector(".widget__blob");
const widgetSideBar = document.querySelector(".widget__sidebar");
const arrowPointer = document.querySelector(".arrow__pointer");
const weatherEl = document.querySelector(".weather");
const paletteContainer = document.querySelector(".color__palette--container");
const colorPalete = document.querySelectorAll(".color__palette");
const dateEl = document.querySelector(".date");

window.addEventListener("load", function () {
  const paletteColor = localStorage.getItem("palette");
  widgetSideBar.style.backgroundColor = paletteColor;
  widgetBlob.style.backgroundColor = paletteColor;
  arrowPointer.style.backgroundColor = paletteColor;

  const btn = document.querySelector(
    `.color__palette[data-bgcolor="${paletteColor}"]`
  );
  colorPalete.forEach((el) => el.classList.remove("color__palette--active"));
  btn.classList.add("color__palette--active");
});

// REVEALING SIDEBAR ON CLICK
const revealSideBar = function () {
  widgetSideBar.classList.toggle("hidden");
};

// Passing in the Reveal Sidebar function on the Widget Sidebar
widgetBlob.addEventListener("click", function () {
  revealSideBar();
  getDnT();
});

// DYNAMICALLY FILLIG IN THE PALETTE COLORS
colorPalete.forEach((el) => (el.style.backgroundColor = el.dataset.bgcolor));

// CHANGING THEME
const themeChanger = function (e) {
  widgetSideBar.style.backgroundColor = e.target.dataset.bgcolor;
  widgetBlob.style.backgroundColor = e.target.dataset.bgcolor;
  arrowPointer.style.backgroundColor = e.target.dataset.bgcolor;
  colorPalete.forEach((el) => el.classList.remove("color__palette--active"));
  e.target.classList.add("color__palette--active");
  setLocalStorage(e.target.dataset.bgcolor);
};

// Passing in the theme changer function on the color palette.
colorPalete.forEach((el) => {
  el.addEventListener("click", themeChanger);
});

// MAKING THE SIDEBAR CLOSEABLE BY PRESING ESCAPE
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !widgetSideBar.classList.contains("hidden")) {
    widgetSideBar.classList.toggle("hidden");
  }
});

// CREATING LIVE DATES
// Create current date and time

const getDnT = function () {
  const now = new Date();
  const dateOptions = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  };

  const locale = navigator.language;

  const curDate = new Intl.DateTimeFormat(locale, dateOptions).format(now);

  dateEl.textContent = `Your current date and time is ${curDate}`;
};

// DISPLAYING THE WEATHER DATA BASED ON USER'S CURRENT LOCATION
// PART 1
// GETTING THE USERS CURRENT LOACTION USING PROMISES

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

getPosition().catch((err) =>
  alert(`${err.message}. Please grant location access`)
);

// if (getPosition) {
// }
const whereAmI = async function () {
  try {
    // CONSUMING THE GEOLOCATION PROMISE AND EXTRACTING THE LONGITUTE AND LATITUDE VALUES
    const position = await getPosition();
    const { latitude, longitude } = position.coords;

    // USING A REVERSE-GEOLOCATION API TO CONVERT YOUR lONGITUDE AND LATITUDE VALUES INTO A DEFINED LOCATION
    const responseGeo = await fetch(
      `https://geocode.xyz/${latitude},${longitude}?geoit=json&auth=YOUR_API_KEY`
    );

    if (!responseGeo.ok) throw new Error("Problem getting location data");
    const dataGeo = await responseGeo.json();
    console.log(dataGeo);
    console.log(dataGeo.city);

    // USING A WEATHER API TO FETCH WEATHER DATA BASED ON YOUR CURRENT LOCATION
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`
    );
    if (!weatherResponse.ok) throw new Error("Problem getting Weather data");

    const weatherData = await weatherResponse.json();
    console.log(weatherData);

    const [curWeather] = weatherData.hourly.temperature_2m;
    console.log(curWeather);

    console.log(
      `The weather in ${dataGeo.region} right now is ${curWeather} ${weatherData.hourly_units.temperature_2m}`
    );

    const finalWeather = `The weather in ${dataGeo.region} right now is ${curWeather} ${weatherData.hourly_units.temperature_2m}`;

    weatherEl.insertAdjacentText("beforeend", finalWeather);
  } catch (err) {
    console.log(`${err} 💥💥💥`);
  }
};
whereAmI();
