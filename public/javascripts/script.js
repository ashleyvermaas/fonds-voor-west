document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);

// let coordinates = {
//   lat: Number(document.getElementById('lat').innerHTML),
//   lng: Number(document.getElementById('lng').innerHTML),
// }

const amsterdamWest = {
  lat: 52.37524007976412, 
  lng: 4.862769947828028 
}


const google_key = document.getElementById('google-key').innerHTML;
//const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${google_key}`;
let coordinates = {
  lat: Number(document.getElementById('lat').innerHTML),
  lng: Number(document.getElementById('lng').innerHTML),
}

console.log(coordinates);

function initMap(coordinates) {
  const map = new google.maps.Map(document.getElementById("map"), 
  {
      zoom: 18,
      center: coordinates
    }
  );
const marker = new google.maps.Marker({
    position: {
      lat: coordinates.lat,
      lng: coordinates.lng
    },
    map: map,
    title: "Project location"
  });
}

initMap(coordinates);


function geocodeAddress(geocoder, resultsMap) {
  const address = document.getElementById("address").value;
  geocoder.geocode({ address: address }, (results, status) => {
    if (status === "OK") {
      resultsMap.setCenter(results[0].geometry.location);
      new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location,
      });
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

let placeSearch;
let autocomplete;

const componentForm = {
  street_number: "short_name",
  route: "long_name",
  locality: "long_name",
  administrative_area_level_1: "short_name",
  country: "long_name",
  postal_code: "short_name",
};

function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("autocomplete"),
    { types: ["geocode"] }
  );

  autocomplete.setFields(["address_component"]);
  autocomplete.addListener("place_changed", fillInAddress);
}

function fillInAddress() {
  const place = autocomplete.getPlace();

  for (const component in componentForm) {
    document.getElementById(component).value = "";
    document.getElementById(component).disabled = false;
  }

  for (const component of place.address_components) {
    const addressType = component.types[0];

    if (componentForm[addressType]) {
      const val = component[componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }
}

function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      const circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy,
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}


