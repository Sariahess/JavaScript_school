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

      console.log(stop);
    });

    if (busStopList.innerHTML === ``) {
      busStopList.innerHTML = `No streets found`;
    }

    return json.streets;
  })
  .then(() => {
    busStopList.onclick = function(eve) {
      const streetKey = eve.target.dataset.streetKey;
      
      fetch(`https://api.winnipegtransit.com/v3/stops.json?street=${streetKey}&api-key=${myAPI}`)
        .then(resp => {
          if (resp.ok) {
            return resp.json();
          } else {
            throw new Error(errMessage);
          }
        })
        .then(json => {
          console.log(json);
        });
    }
  })
  .catch((err) => {
    alert(err);
  });
}


// https://api.winnipegtransit.com/v3/stops.json?street=${   }&api-key=${myAPI}