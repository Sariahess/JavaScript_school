const streetSearch = document.querySelector(`form`);
const myAPI = `VPiUgdvsNWWxzgQ7bx`;
const busStop = document.querySelector(`.streets`);  

streetSearch.onsubmit = function(eve) {
  const streetName = eve.target.querySelector(`input[type=text]`);
  searchStreet(streetName.value);
  streetName.value = ``;
  eve.preventDefault();
}

function searchStreet(query) {
  fetch(`https://api.winnipegtransit.com/v3/streets.json?name=${query}&api-key=${myAPI}`)
  .then(resp => {
    if (resp.ok) {
      return resp.json();
    } else {
      throw new Error(errorMessage);
    }
  })
  .then(json => {
    busStop.innerHTML = ``;

    json.streets.forEach(stop => {
      getBusStop(stop);
    });
  })
  .catch(err => {
    getBusStop(`${err}`);
  });
}

function getBusStop(query) {
  busStop.insertAdjacentHTML(`beforeend`, 
    `<a href="#" data-street-key="${query.key}">${query.name}</a>`);
}
