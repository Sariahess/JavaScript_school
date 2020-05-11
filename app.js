const streetSearch = document.querySelector(`form`);
const myAPI = `VPiUgdvsNWWxzgQ7bx`;
const busStopList = document.querySelector(`.streets`);

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
      throw new Error(errMessage);
    }
  })
  .then(json => {
    busStopList.innerHTML = ``;

    json.streets.forEach(stop => {
      busStopList.insertAdjacentHTML(`beforeend`, 
        `<a href="#" data-street-key="${stop.key}">${stop.name}</a>`
      );
    });

    if (busStopList.innerHTML === ``) {
      busStopList.innerHTML = `No streets found`;
    }

    return json.streets;
  })
  .then(() => {
    busStopList.onclick = function(eve) {
      const busStopKey = eve.target.dataset.streetKey;
      console.log(busStopKey);
    }
      //stops/${key}/schedule?max-results-per-route=2
  })
  .catch((err) => {
    alert(err);
  });
}
