const maps = L.map('maps').setView([32.75, -83.388], 7);

	const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(maps);



 
    function getColor(d) {
		return  d > 4 ? 'orange' :
		d > 3 ? 'purple' :
		d > 2  ? 'green' :
		d > 1  ? 'red' :
		'blue';
	  }
	
  


	// get color depending on population density value
  function style(feature) {
		return {
			weight: 2,
			opacity: 1,
			color: 'black',
			dashArray: '3',
			fillOpacity: 1.0,
			fillColor: getColor(feature.properties.TYPE_ID)
		};
	}

	function highlightFeature(e) {
		const layer = e.target;

		layer.setStyle({
			weight: 5,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7
		});

		layer.bringToFront();

		info.update(layer.feature.properties);
	}



	/* global statesData */
	const geojson = L.geoJson(resultsData, {
		style,
		onEachFeature
	}).addTo(maps);

	function resetHighlight(e) {
		geojson.resetStyle(e.target);
		info.update();
	}

	function zoomToFeature(e) {
		maps.fitBounds(e.target.getBounds());
	}

	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	}

	const info = L.control();

		info.update = function (props) {
        
        const precinctName = props ? props.Precinct : 'Unknown Precinct';
        
    
	
	};

	console.log(info)

	

	


	const legend = L.control({position: 'bottomright'});

	legend.onAdd = function (maps) {

		const div = L.DomUtil.create('div', 'info legend');
		const grades = [1,2,3,4];
		const labels =[ '<i style="background:#6495ED"></i> ABC', '<i style="background:#FFA500"></i> GA Power', '<i style="background:#FF0000"></i> Muni' ];
		let from, to;

		for (let i = 0; i < grades.length; i++) {
			from = grades[i];
			to = grades[i + 1];

      


			
		}
    console.log(labels)

		div.innerHTML = labels.join('<br>');
		return div;
	};

	legend.addTo(maps);

	// function createCustomIcon (feature, latlng) {
	// 	let myIcon = L.icon({
	// 	  iconUrl: 'datacenter.jpg',
	// 	  iconSize:     [25, 25], // width and height of the image in pixels
	// 	  shadowSize:   [35, 20], // width, height of optional shadow image
	// 	  iconAnchor:   [12, 12], // point of the icon which will correspond to marker's location
	// 	  shadowAnchor: [12, 6],  // anchor point of the shadow. should be offset
	// 	  popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
	// 	})
	// 	return L.marker(latlng, { icon: myIcon })
	//   }
	  
	//   // create an options object that specifies which function will called on each feature
	//   let myLayerOptions = {
	// 	pointToLayer: createCustomIcon
	//   }

	// const dataCentersGeojson= L.geoJson(dataCenters,myLayerOptions, {
	// 	style,
	// 	onEachFeature,
	// }).addTo(map); 


	