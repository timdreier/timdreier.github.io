$(document).ready(function() {
    var map = L.map('map', {
        center: [48.365738, 10.886133],
        zoom: 13
    });

    $.ajax({
        type: "GET",
        url: "customers.csv",
        dataType: "text",
        success: function(data) {$('#nodes').val(data)}
    });

    var routes;
    var markers;
    var connections;

    $('#routes').val('{}')

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

    function parseCSV(csv) {
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
        return lines;
    }

    $( '#show' ).click(function () {
        //Parse Routes
        let routes_raw = $('#routes').val();
        routes = JSON.parse(routes_raw);

        let nodes_csv = $('#nodes').val();
        let lines = parseCSV(nodes_csv);

        //Remove markers
        if (typeof markers !== 'undefined') {
            markers.clearLayers();
        }
        markers = L.layerGroup().addTo(map);

        if ($('#showunused').is(':checked')) {
            lines.forEach(node => {
                addMarker(node);
            });
        }
        else {
            lines.forEach((node) => {
                let used_nodes = routes.reduce(function(prev, next) {return prev.concat(next);})
                let current_node = [node[1],node[2]];
                if (used_nodes.some(r => r.length == current_node.length && r.every((value, index) => current_node[index] == value))) {
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
                latlngs.push([node[0],node[1]]);
            })
            L.polyline(latlngs, {color: getRandomColor()}).addTo(connections);
        });
        connections.addTo(map);
    })
});