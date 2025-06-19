let Jsondata;
let myBarChart;



const maps = L.map('maps').setView([33.9608, -83.988441], 10.4);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 12,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(maps);

function getColor(d) {
	return d > 4 ? 'yellow' :
		d > 3 ? '#8533ff' :
		d > 2 ? "#ff8a33":
		d > 1 ?  '#33cc33':
		"#c91d28";
}

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

function resetHighlight(e) {
	geojson.resetStyle(e.target);
	info.update(); // call with no props to reset
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

// Define info control
const info = L.control();

info.onAdd = function (maps) {
	this._div = L.DomUtil.create('div', 'info');
	this.update(); // initialize with no props
	return this._div;
};

info.update = function (props) {
	

	if (props) {
		const precinctName = props ? props.Precinct :'All';
		this._div.innerHTML = `<h4>Precincts</h4><b>${precinctName}</b><br />`;

		const selectedRadioButton = document.querySelector('input[name="option"]:checked');
		if (!selectedRadioButton) {
			this._div.innerHTML += "<br/><i>No option selected</i>";
			return;
		}

		const selectedRadioButtonValue = selectedRadioButton.value;

		fetch("PSCGwinnettvotes.json")
			.then(response => response.ok ? response.json() : Promise.reject("Failed to load JSON"))
			.then(data => {
				Jsondata = data[selectedRadioButtonValue];
				createChart(Jsondata, precinctName);
			})
			.catch(err => {
				this._div.innerHTML += "<br/><i>Error loading data</i>";
				console.error(err);
			});
	} else {
		this._div.innerHTML = "<h4>US Population Density</h4>Hover over a precinct";
	}
};

info.addTo(maps);

// Must define `onEachFeature` before using it
const geojson = L.geoJson(resultsData, {
	style,
	onEachFeature
}).addTo(maps);







const legend = L.control({ position: 'bottomright' });

legend.onAdd = function (maps) {

	const div = L.DomUtil.create('div', 'info legend');
	const grades = [1, 2, 3, 4];
	const labels = ['Candidates','','<i style="background:#33cc33"></i> Peter Hubbard', '<i style="background:#ff8a33"></i> Robert Jones', '<i style="background:#c91d28"></i> Keisha Sean Waites', '<i style="background:#8533ff"></i> Tied'];
	let from, to;

	for (let i = 0; i < grades.length; i++) {
		from = grades[i];
		to = grades[i + 1];





	}


	div.innerHTML = labels.join('<br>');
	return div;
};

legend.addTo(maps);



function createChart(Jsondata, precinctName) {



	const selectedPrecinct = Jsondata.filter(item => item.Precinct == precinctName);
	const canNames = selectedPrecinct.map(item => item['Ballot Name']);
	const data = selectedPrecinct.map(item => item['PerVote']);
	const totalVotes = selectedPrecinct.map(item => item['Total']);



	

	let backgroundColors

	if (canNames.length ==4) {
		 backgroundColors=[ "#3366ff", "#33cc33", "#ff8a33", "#c91d28"]
	}

	else {
		backgroundColors=["#33cc33", "#ff8a33", "#c91d28"]
	}

	

	// data sample for the chart

let ds = {
	labels: canNames,
	datasets: [{
		label: 'Percentage of Vote',
		data: data,
		datatot:totalVotes,
		backgroundColor: backgroundColors,
		borderColor: 'rgba(150, 100, 255, 1)',
		borderWidth: 1
	}]
};

// Configuration options for the chart
const options = {
	plugins: {
		        
		legend: {
			display: false // This hides the entire legend
		},
		tooltip: {
			callbacks: {
				 
				label: function (context) {

					netIndex = Number(context.dataIndex)
					
				
					let percentage = (context.raw * 100).toFixed(2);
					return [`${context.label}: ${percentage}%`,
					"Vote Count: " + context.dataset.datatot[netIndex],
					]
				}
			}
		}
	},
	scales: {
		y: {
			beginAtZero: true,
			ticks: {
				callback: (value) => {
					return `${(value * 100).toFixed(2)} %`;
				}
			}
		}
	}
};




	const ctx1 = document.getElementById('chart1').getContext('2d');

	if (myBarChart) {
		myBarChart.destroy(); // This removes the previous chart from the canvas
	}

	// Create the new chart
	myBarChart = new Chart(ctx1, {
		type: 'bar',
		data: ds,
		options: options
	});


}


