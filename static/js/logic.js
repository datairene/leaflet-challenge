var map = L.map('map').setView([50,-100], 3);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson';

d3.json(url).then(data => {
    L.geoJSON(data, {

        style: function (feature) {
            let mag = feature.properties.mag;
            let depth = feature.geometry.coordinates[2];

            console.log();
            return {
                color: 'black',
                weight: 1,
                radius: mag*2,
                fillOpacity: .5,
                fillColor: 
                    depth > 90 ? 'red' :
                    depth > 70 ? 'darkorange' :
                    depth > 50 ? 'orange' :
                    depth > 30 ? 'yellow' :
                    depth > 10 ? 'lime' : 'green'
            };
        },
        pointToLayer: function(geoJsonPoint, latlng) {
            return L.circleMarker(latlng);
        }

    }).bindPopup(function (layer) {
        let mag = layer.feature.properties.mag;
        let place = layer.feature.properties.place;
        let time = new Date(layer.feature.properties.time).toLocaleString();

        return `<h4>${place}<br>Magnitude: ${mag}<br>${time}</h4>`;
    }).addTo(map);
});

let legend = L.control({"position": "bottomright"});

legend.onAdd = ()=>{
    let div = L.DomUtil.create("div","legend");
    div.innerHTML = `
    <div style='padding:2px;background:red'>90+</div>
    <div style='padding:2px;background:darkorange'>70-90</div>
    <div style='padding:2px;background:orange'>50-70</div>
    <div style='padding:2px;background:yellow'>30-50</div>
    <div style='padding:2px;background:lime'>10-30</div>
    <div style='padding:2px;background:green'>-10-10</div>
`;

    return div;
};

legend.addTo(map)