var map;
var address = 'Toronto, ON, Canada';
var info = document.getElementById('alert');

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: {lat: 43.71839831777034, lng: -79.37805800000001},
		scrollwheel: false
  });

	var search = document.getElementById('search');
	var lat = document.getElementById('lat');
	var lng = document.getElementById('lng');

	var autocomplete = new google.maps.places.Autocomplete(search);
  autocomplete.bindTo('bounds', map);

  var marker = new google.maps.Marker({
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: map.getCenter()
  });

	autocomplete.addListener('place_changed', function() {
		info.style.display = 'none';
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      info.innerHTML = "Autocomplete's returned place contains no geometry";
      return;
    }

		// If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }

		search.value = address = place.formatted_address;
		marker.setVisible(true);
	});
	
	map.addListener('center_changed', function() {
		info.style.display = 'none';
		marker.setPosition(this.getCenter());

		lat.value = marker.position.lat();
		lng.value = marker.position.lng();
  });
  
	marker.addListener('dragend', function() {
		map.setCenter(this.position);
  });
	
	search.addEventListener('focus', function () {
		this.value = '';
	});

	search.addEventListener('focusout', function () {
		this.value = address;
	});

	search.value = address;
	lat.value = marker.position.lat();
	lng.value = marker.position.lng();
}

document.getElementById('position').addEventListener('click', function() {
	if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map.setCenter(pos);

    }, function() {
			info.style.display = 'block';
			info.innerHTML = "Error: The Geolocation service failed.";
    });
  } else {
    // Browser doesn't support Geolocation
		info.style.display = 'block';
    info.innerHTML = "Error: Your browser doesn\'t support geolocation.";
  }
});