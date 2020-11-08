var routes;
var markers;
var connections;

$(document).ready(function() {
    var map = L.map('map', {
        center: [48.365738, 10.886133],
        zoom: 13
    });

    $.ajax({
        type: "GET",
        url: "Filialen.csv",
        dataType: "text",
        success: function(data) {$('#nodes').val(data)}
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function addMarker( node ) {
        let marker = L.marker([node[1], node[2]]).addTo(markers)
            .bindPopup(node[0] + ' (Nachfrage: ' + node[3] + ')');
    }

    $( '#show' ).click(function () {
        //Parse Routes
        let routes_raw = $('#routes').val()
            .replaceAll('> <',',')
            .replaceAll('<','')
            .replaceAll('>','')
            .replaceAll(' ',',')
            .replaceAll('{','[')
            .replaceAll('}',']');
        routes = JSON.parse(routes_raw);

        //Parse CSV
        let csv = $('#nodes').val();

        var csv_lines = csv.split(/\r\n|\n/);
        var headers = csv_lines[0].split(';');
        var lines = [];

        for (var i=1; i<csv_lines.length; i++) {
            var data = csv_lines[i].split(';');
            if (data.length == headers.length) {

                var tarr = [];
                for (var j=0; j<headers.length; j++) {
                    tarr.push(data[j]);
                }
                lines.push(tarr);
            }
        }

        //Remove markers
        if (typeof markers !== 'undefined') {
            markers.clearLayers();
        }
        markers = L.layerGroup().addTo(map);

        //Add markers
        if ($('#showunused').is(':checked')) {
            lines.forEach(node => {
                addMarker(node);
            });
        }
        else {
            lines.forEach((node, index) => {
                if (routes.some(route => route.includes(index))) {
                    addMarker(node);
                }
            });
        }

        if (typeof connections !== 'undefined') {
            connections.clearLayers();
        }
        connections = L.layerGroup().addTo(map);

        routes.forEach(route => {
            var latlngs = [];
            route.forEach(node => {
                latlngs.push([lines[node][1],lines[node][2]])
            })
            latlngs.push([lines[0][1],lines[0][2]])
            var polyline = L.polyline(latlngs, {color: getRandomColor()}).addTo(connections);
        });
        connections.addTo(map);
    })
});