document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);

const amsterdamWest = {
  lat: 52.37524007976412, 
  lng: 4.862769947828028 
}


function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: amsterdamWest,
  });
  const geocoder = new google.maps.Geocoder();
  document.getElementById("submit").addEventListener("click", () => {
    geocodeAddress(geocoder, map);
  });
}

function geocodeAddress(geocoder, resultsMap) {
  const address = document.getElementById("location").value;
  geocoder.geocode({ address: address }, (results, status) => {
    if (status === "OK") {
      resultsMap.setCenter(results[0].geometry.location);
      console.log(results[0].geometry.location)
      new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location,
      });
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}