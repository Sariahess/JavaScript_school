const streetSearch = document.querySelector(`form`);
const myAPI = `VPiUgdvsNWWxzgQ7bx`;
const busStopList = document.querySelector(`.streets`);
const tbody = document.querySelector(`tbody`);
const street = document.querySelector(`#street-name`);

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
    }
  })
  .then(json => {
    busStopList.innerHTML = ``;
    tbody.innerHTML = ``;
    street.innerHTML = ``;
    
    json.streets.forEach(stop => {
      busStopList.insertAdjacentHTML(`beforeend`, 
        `<a href="#" data-street-key="${stop.key}">${stop.name}</a>`
      );
    });

    if (json.streets.length === 0) {
      busStopList.innerHTML = `No streets found`;
    }
  })
}

busStopList.onclick = function(eve) {
  const streetKey = eve.target.dataset.streetKey;
  street.innerHTML = `Displaying results for ${eve.target.innerHTML}`;
  
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
        let promisesArr = [];
        fetch(`https://api.winnipegtransit.com/v3/stops/${stopNum}/schedule.json?max-results-per-route=2&?usage=long&api-key=${myAPI}`)
          .then(resp => {
            return resp.json();
          })
          .then(json => {
            promisesArr.push(json);
            Promise.all(promisesArr).then(function() {
              display(json["stop-schedule"]);
            });
          });
      });
    })
    .catch(err => {
      alert(err);
    });
}

function display(obj) {
  const time = new Date(obj["route-schedules"][0]["scheduled-stops"][0].times.departure.scheduled);

  tbody.insertAdjacentHTML(`beforeend`, `
    <tr>
      <td>${obj.stop.name}</td>
      <td>${obj.stop["cross-street"].name}</td>
      <td>${obj.stop.direction}</td>
      <td>${obj["route-schedules"][0].route.number}</td>
      <td>${timeConverter(time)}</td>
    </tr>
  `);
}

// put 0 on the lefthand side if it's a 1-digit number.
function lengthConverter(num) {
  if (num < 10) {
    return `0${num}`;
  } else {
    return num;
  }
}

// trim the time expression
function timeConverter(timeElement) {
  const hour = timeElement.getHours();
  const minute = timeElement.getMinutes();

  return hour > 12 ? `${lengthConverter(hour - 12)}:${lengthConverter(minute)} PM` : `${lengthConverter(hour)}:${lengthConverter(minute)} AM`;
}