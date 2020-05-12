const streetSearch = document.querySelector(`form`);
const myAPI = `VPiUgdvsNWWxzgQ7bx`;
const busStopList = document.querySelector(`.streets`);
const tbody = document.querySelector(`tbody`);


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
      const streetKey = eve.target.dataset.streetKey;
      
      fetch(`https://api.winnipegtransit.com/v3/stops.json?street=${streetKey}&api-key=${myAPI}`)
        .then(resp => {
          return resp.json();
        })
        .then(json => {            
          let busStopArr = [];

          json.stops.forEach(stop => {
            busStopArr.push(stop.key);
          });

          if (busStopArr.length === 0) {
            throw new Error(`There are no bus stops on this street`);
          } else {
            return busStopArr;
          }
        })
        .then(arr => {
          arr.forEach(stopNum => {
            fetch(`https://api.winnipegtransit.com/v3/stops/${stopNum}/schedule.json?max-results-per-route=1&api-key=${myAPI}`)
              .then(resp => {
                return resp.json();
              })
              .then(json => {
                display(json["stop-schedule"]);
              });
          });
        })
        .catch(err => {
          alert(err);
        });
    }
  });
}

function display(obj) {
  const time = obj["route-schedules"][0]["scheduled-stops"][0].times.departure.scheduled;

  tbody.insertAdjacentHTML(`beforeend`, `
    <tr>
      <td>${obj.stop.name}</td>
      <td>${obj.stop["cross-street"].name}</td>
      <td>${obj.stop.direction}</td>
      <td>${obj["route-schedules"][0].route.number}</td>
      <td>${time.slice(time.length - 8, time.length - 3)}</td>
    </tr>
  `);
}