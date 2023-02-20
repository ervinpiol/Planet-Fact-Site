let activePlanetColor = "";
let structure = `
          <span>02</span> INTERNAL STRUCTURE
          `;
let surface = `
          <span>03</span> SURFACE GEOLOGY
          `;

fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    let planet = data[0];

    const planets = document.querySelectorAll(".planeta");
    planets.forEach((p) => {
      p.addEventListener("click", () => {
        // Find the planet in the data that matches the clicked planet name
        let planet = data.find(
          (d) => d.name.toLowerCase() === p.textContent.toLowerCase()
        );

        // Update the HTML with the new planet information
        const planetHtml = `
          <div class="top">
            <div class="planet_img_container">
              <img class="planet_img" src="${planet.images.planet}" alt="" />
            </div>
            <div class="planet_info">
              <div class="planet_info_top">
                <h1 class="planet_name">${planet.name}</h1>
                <p class="planet_description">
                  ${planet.overview.content}
                </p>
                <p class="source">
                  Source :
                  <a class="link" href="${planet.overview.source}" target="_blank">
                    Wikipedia <img src="images/icon-source-129514eb.svg" alt="" />
                  </a>
                </p>
              </div>
              <div class="planet_info_bottom">
              <button class="overview info_button pick">
              <span>01</span> OVERVIEW
            </button>
            <button class="internal info_button">
              <span>02</span> INTERNAL STRUCTURE
            </button>
            <button class="geology info_button">
              <span>03</span> SURFACE GEOLOGY
            </button>
              </div>
            </div>
          </div>

          <div class="planet_data">
            <div class="data_style rotation">
              <p>ROTATION TIME</p>
              <h2>${planet.rotation}</h2>
            </div>
            <div class="data_style revolution">
              <p>REVOLUTION TIME</p>
              <h2>${planet.revolution}</h2>
            </div>
            <div class="data_style radius">
              <p>RADIUS</p>
              <h2>${planet.radius}</h2>
            </div>
            <div class="data_style temperature">
              <p>AVERAGE TEMP.</p>
              <h2>${planet.temperature}</h2>
            </div>
          </div>
        `;
        const container = document.querySelector(".container");
        container.innerHTML = planetHtml;

        // Update the active class on the planet name in the menu
        planets.forEach((p) => p.classList.remove("active"));
        p.classList.add("active");

        ggBTN(planet);

        const mql = window.matchMedia("(max-width: 768px)");

        const internalButton = document.querySelector(".internal.info_button");
        const geologyButton = document.querySelector(".geology.info_button");
        if (mql.matches) {
          internalButton.textContent = "STRUCTURE";
          geologyButton.textContent = "SURFACE";
        } else {
          internalButton.innerHTML = structure;
          geologyButton.innerHTML = surface;
        }

        document.documentElement.style.setProperty(
          "--active-planet-color",
          planet.color
        );

        activePlanetColor = planet.color;
        document.querySelector(".overview").style.backgroundColor =
          activePlanetColor;
      });
      //CHANGE HOVER COLOR
      p.addEventListener("mouseover", () => {
        const hoverSelector = `li:hover::before`;
        document.styleSheets[0].addRule(
          hoverSelector,
          `background-color: ${activePlanetColor};`
        );
      });
    });
    ggBTN(planet);
    /* BG COLOR OF THE .pick::after */
    document.documentElement.style.setProperty(
      "--active-planet-color",
      planet.color
    );
  });

function ggBTN(planet) {
  const planetImg = document.querySelector(".planet_img_container");
  const infoButtons = document.querySelectorAll(".info_button");
  const buttonIds = ["planet", "internal", "geology"];
  const details = ["overview", "structure", "geology"];

  infoButtons.forEach((infoButton, index) => {
    infoButton.addEventListener("click", () => {
      infoButtons.forEach((button) => {
        button.classList.remove("pick");
        button.style.backgroundColor = "";
      });
      infoButton.classList.add("pick");
      infoButton.style.backgroundColor = planet.color;

      if (infoButton.classList.contains("geology")) {
        // if the geology button is clicked, add both planet and geology images
        planetImg.innerHTML = `<img src="${planet.images.planet}" alt="" class="planet_img"/><img src="${planet.images.geology}" alt="" class="geology-img"/>`;
      } else {
        // for other buttons, add only the relevant image
        planetImg.innerHTML = `<img class="planet_img" src="${
          planet.images[buttonIds[index]]
        }" alt="" />`;
      }
      const description = planet[details[index]].content;
      const source = planet[details[index]].source;

      document.querySelector(".planet_description").innerHTML = `
      <p class="planet_content">${description}</p>`;
      document.querySelector(".source").innerHTML = `
      <p class="source"> Source : <a class="link" href="${source}" target="_blank">
      Wikipedia <img src="images/icon-source-129514eb.svg" alt="" /></a></p>
      `;
    });
  });
}
function updateInternalButton(mql) {
  const internalButton = document.querySelector(".internal.info_button");
  const geologyButton = document.querySelector(".geology.info_button");
  const ul = document.querySelector("ul");

  if (mql.matches) {
    internalButton.textContent = "STRUCTURE";
    geologyButton.textContent = "SURFACE";
    ul.style.display = "none";
    ul.querySelectorAll("li").forEach((planet) =>
      planet.addEventListener("click", menuListener)
    );
  } else {
    internalButton.innerHTML = structure;
    geologyButton.innerHTML = surface;
    ul.style.display = "flex";
    ul.querySelectorAll("li").forEach((planet) =>
      planet.removeEventListener("click", menuListener)
    );
  }
}

const mql = window.matchMedia("(max-width: 768px)");

updateInternalButton(mql); // call once to set initial state

mql.addListener(updateInternalButton); // listen for changes

/* MENU */
const menuButton = document.querySelector(".menu_icon");
const ul = document.querySelector("ul");
const body = document.body;

menuButton.addEventListener("click", menuListener);

function menuListener() {
  if (ul.style.display === "flex") {
    ul.style.display = "none";
    body.style.overflow = "auto";
  } else {
    ul.style.display = "flex";
    body.style.overflow = "hidden";
  }
}
