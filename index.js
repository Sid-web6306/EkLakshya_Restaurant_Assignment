//To Calculate Area

function calculateArea(a, b, c) {
  let s = (a + b + c) / 2;
  return Math.sqrt((s) * Math.abs(s - a) * Math.abs(s - b) * Math.abs(s - c)).toPrecision(8);
}

const spinner = document.getElementById("spinner");
const button = document.getElementsByClassName("button")[0];
const hide_show = document.getElementsByClassName("hish")[0];

//Spinner Function to spin when fetching Api
function showSpinner() {
    button.style.display="none";
    hide_show.style.display="none";
    spinner.className = "show";
  setTimeout(() => {
    spinner.className = spinner.className.replace("show", "");
    button.style.display="block";
    hide_show.style.display="block";
  }, 4000);
}

//When error Occcured Spinner goes again
function showSpinnerInfinite() {
    button.style.display="none";
    hide_show.style.display="none";
    spinner.className = "show";
  setTimeout(() => {
    spinner.className = spinner.className.replace("show", "");
    button.style.display="block";
    hide_show.style.display="block";
  }, 100000000);
}


//Function for finding User Location
function showLocation(position) {
  var latitude = position.coords.latitude;//user Latitude
  var longitude = position.coords.longitude;//user longitude
  const apiKey = "48ccbd63195070771f8854a5635fac6a";// Zomato Api Key
  showSpinner();

  //Zomato Api
  const url = `https://developers.zomato.com/api/v2.1/search?count=10&lat=${latitude}&lon=${longitude}&sort=real_distance&order=asc`;

  //fetching Url


  //                           TASK 1
  window.fetch(url, {
          headers: {
              "user-key": apiKey
          }
      })
      .then(response => {
          return response.json();

      })
      .then(json => {
          
          console.log(json);
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;
          console.log(json.restaurants[0].restaurant.location.latitude);
          console.log(json.restaurants[json.restaurants.length - 1].restaurant.location.latitude);
          //Near restaurant Loaction
          let nearlat = json.restaurants[0].restaurant.location.latitude;
          let nearlong = json.restaurants[0].restaurant.location.longitude;
          //Far restaurant Loaction
          let farlat = json.restaurants[9].restaurant.location.latitude;
          let farlong = json.restaurants[9].restaurant.location.longitude;
          //  console.log(dis_far_near);

          //function for getting Distance between two points.

          function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
              var R = 6371; // Radius of the earth in km
              var dLat = deg2rad(lat2 - lat1); // deg2rad below
              var dLon = deg2rad(lon2 - lon1);
              var a =
                  Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
              var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              var d = R * c; // Distance in km
              return d;
          }

          function deg2rad(deg) {
              return deg * (Math.PI / 180)
          }

          //distance b/w user and near_restaurant
          let dis_user_near = getDistanceFromLatLonInKm(latitude, longitude, nearlat, nearlong);
          //distance b/w user and far_restaurant
          let dis_far_user = getDistanceFromLatLonInKm(latitude, longitude, farlat, farlong);
          //distance b/w far_restaurant and near_restaurant
          let dis_far_near = getDistanceFromLatLonInKm(farlat, farlong, nearlat, nearlong);


          // console.log(dis_far_user);
          // console.log(dis_user_near);
          // console.log(total_dis);



          //Time _taken (TASK 1)
          let Timetaken = ((dis_far_near + dis_far_user + dis_user_near)/5).toPrecision(8);
          //Area (Task 1)
          let area = calculateArea(dis_user_near, dis_far_near, dis_user_near);

          //                  TASK 2
       
          //HERE Api key 
          const api_key = '9cLXZLcK0GKPqUIizUikwYDfZoBkfuF7ZH3ogSQJkPI';
        //   console.log("near lalo: ", nearlat, nearlong);
        //   console.log("user lalo: ", latitude, longitude);
        //   console.log("far lalo: ", farlat, farlong);



          //Fetching Api of HERE Maps

          Promise.all([
              fetch(`https://router.hereapi.com/v8/routes?transportMode=car&origin=${latitude},${longitude}&destination=${nearlat},${nearlong}&return=summary&apiKey=9cLXZLcK0GKPqUIizUikwYDfZoBkfuF7ZH3ogSQJkPI`),
              fetch(`https://router.hereapi.com/v8/routes?transportMode=car&origin=${nearlat},${nearlong}&destination=${farlat},${farlong}&return=summary&apiKey=9cLXZLcK0GKPqUIizUikwYDfZoBkfuF7ZH3ogSQJkPI`),
              fetch(`https://router.hereapi.com/v8/routes?transportMode=car&origin=${latitude},${longitude}&destination=${farlat},${farlong}&return=summary&apiKey=${api_key}`),
          ]).then(function(responses) {
              return Promise.all(responses.map(response => response.json()));
          }).then(function(data) {
            //distance b/w user and near_restaurant
              let dis_user_near = data[0].routes[0].sections[0].summary.length / 1000;
              //distance b/w far_restaurant and near_restaurant
              let dis_far_near = data[1].routes[0].sections[0].summary.length / 1000;
              //distance b/w user and far_restaurant
              let dis_far_user = data[2].routes[0].sections[0].summary.length / 1000;
              //Area (TASK 2)
              let area2 = calculateArea(dis_far_near, dis_far_user, dis_user_near);
              //Time_Taken (TASK 2)
              let timeTaken = ((dis_far_near + dis_far_user + dis_user_near) / 5).toPrecision(8);
              // console.log(dis_user_near);
              // console.log(dis_far_near);
              // console.log(dis_far_user);
              // console.log(timeTaken);
            let Location = document.getElementById("Location");
            Location.innerText = `Your Coordinates: ${latitude} , ${longitude}`;
              let content = document.getElementsByClassName("content")[0];
              content.innerHTML = `
              <div class="feature-card feature-supervisor">
              <h1 class="feature-card__title">TASK 1</h1>
              <h4 class="feature-card__text">
                Area (in Km <sup>2</sup> ): ${area}
              </h4>
              <h4 class="feature-card__text">
                Time Taken: (in hours): ${Timetaken}
              </h4>
              <img
                class="feature-card__img"
                src="images/icon-supervisor.svg"
                alt="icon-supervisor"
              />
            </div>
            <div class="feature-card feature-supervisor">
              <h1 class="feature-card__title">TASK 2</h1>
              <h4 class="feature-card__text">
                Area <span>(in Km <sup>2</sup> ): ${area2}
              </h4>
              <h4 class="feature-card__text">
                Time Taken: (in hours): ${timeTaken}
              </h4>
              <img
                class="feature-card__img"
                src="images/icon-supervisor.svg"
                alt="icon-supervisor"
              />
            </div>`
          }).catch(function(error) {
              // if there's an error, log it
              console.log(error);
              showSpinnerInfinite();
              alert("failed to fetch");
          });
      });




}

//Error Handler
function errorHandler(err) {
  if (err.code == 1) {
      alert("Error: Access is denied!");
  } else if (err.code == 2) {
      alert("Error: Position is unavailable!");
  }
}
//functon for allowing location and get Location fo User

function getLocation() {

  if (navigator.geolocation) {

      // timeout at 60000 milliseconds (60 seconds)

      navigator.geolocation.getCurrentPosition(showLocation, errorHandler);
  } else {
      alert("Sorry, browser does not support geolocation!");
  }
}



