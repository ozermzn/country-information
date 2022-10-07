const search = document.getElementById("txtSearch");
const button = document.getElementById("searchBtn");
const countryDetails = document.getElementById("country-details");
const neighboors = document.getElementById("neighboors");
const locations = document.getElementById("locationBtn");
const errors = document.getElementById("errors");
const load = document.getElementById("load");

button.addEventListener("click", () => {
  getCountry(search.value);
  search.value = "";
  load.style.display = "block";
});
search.addEventListener("keypress", function () {
  if (event.key == "Enter") {
    event.preventDefault();
    button.click();
  }
});
locations.addEventListener("click", () => {
  //Take to user location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }
});
function onError(err) {
  console.log(err);
}
async function onSuccess(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  console.log(latitude, longitude);

  const apiKey = "c09b0c3195424ea0a08c40c488e3c86a";
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  const country = data.results[0].components.country;
  search.value = country;
  button.click();
}

async function getCountry(country) {
  try {
    const response = await fetch(
      "https://restcountries.com/v2/name/" + country
    );
    if (!response.ok) throw new Error("Country is not found.");
    const data = await response.json();
    renderCountry(data[0]);
    const bordersData = data[0].borders;
    console.log(data[0]);
    if (!bordersData) throw new Error("This country have no neighboors");
    const response2 = await fetch(
      "https://restcountries.com/v2/alpha?codes=" + bordersData.toString()
    );
    const neighboors = await response2.json();
    console.log(neighboors);
    renderNeighboors(neighboors);
  } catch (err) {
    renderError(err);
  }
  load.style.display = "none";
}

function renderCountry(data) {
  console.log(data);
  let html = `
  <div class="col-4" >
                  <img src="${data.flags.png}" alt="" class="img-fluid" />
                </div>
                <div class="col-8">
                  <h3 class="card-title" id="homeName" >${data.name}</h3>
                  <div class="border-bottom"></div>
                  <div class="row">
                    <div class="col-4 fw-bold">Population:</div>
                    <div class="col-8">${(data.population / 1000000).toFixed(
                      1
                    )}</div>
                  </div>
                  <div class="row">
                    <div class="col-4 fw-bold">Money:</div>
                    <div class="col-8">${
                      data.currencies[0].name
                    } <span class="badge fs-6">${
    data.currencies[0].symbol
  }</span></div>
                  </div>
                  <div class="row">
                    <div class="col-4 fw-bold">Capital:</div>
                    <div class="col-8">${data.capital}</div>
                  </div>
                  <div class="row">
                    <div class="col-4 fw-bold">Languages:</div>
                    <div class="col-8">${data.languages[0].name}</div>
                  </div>
                </div>`;

  countryDetails.innerHTML = html;
}

function renderNeighboors(data) {
  let html = "";
  for (let country of data) {
    console.log(country.flags.png);
    html += `

    <div class="col-2 mt-2">
    <div class="card" id="neighboorsList">
      <img src="${country.flags.png}" class="card-img-top">
      <div class="card-body">
        <ul class="list-group list-group-flush">
          <li class="list-group-item "><h6 id="neighName" class="card-title">${
            country.name
          }</h6></li>
          <li class="list-group-item"><div class="card-title"><span id="capi" class="">Capital: </span> ${
            country.capital
          }</div></li>
          <li class="list-group-item">
          <div class="card-title"><span id="capi" class="">Money: </span>${
            Object.values(country.currencies)[0].name
          }<div>  <span class="badge rounded-pill">${
      Object.values(country.currencies)[0].symbol
    }</span></div></div></li>


          </ul>
          </div>
          </div>

          </div>
	  `;
    neighboors.innerHTML = html;
  }
}

function renderError(err) {
  const html = `
    <div class="alert alert-danger" role="alert">
    ${err.message}
  </div>
    `;
  setTimeout(function () {
    errors.innerHTML = "";
  }, 3000);
  errors.innerHTML = html;
}
