var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([-2.4711, 54.5701]),
        zoom: 5
    })
});

function httpRequest(method, url, callback, headers, body) {

    const xml = new XMLHttpRequest();
    xml.open(method, url);
    xml.onload = () => {
        let data = xml.response;
        callback(data);
    }
    for (key in headers) {
        xml.setRequestHeader(key, headers[key]);
    }
    body ? xml.send(body) : xml.send();
}

function retrievePubsVisited() {

    let method = "GET";
    let url = "http://34.90.35.87:9000/pubs"
    let callback = getEntries;
    let headers = {
        "Accept": "application/json;charset=UTF-8",
    }
    httpRequest(method, url, callback, headers);


}

function retrievePubLocation(postcode) {
    let method = "GET";
    let url = "http://api.postcodes.io/postcodes/" + postcode;
    let callback = getLatLon;
    let headers = {
        "Accept": "application/json;charset=UTF-8",
    }
    httpRequest(method, url, callback, headers);


}

function getLatLon(data) {
    let retData = JSON.parse(data);

    console.log(retData.result.longitude);

    addMarker(retData.result.latitude, retData.result.longitude);

}

function getEntries(data) {
    retData = JSON.parse(data);

    input = document.getElementById("enteredEmail").value;

    for (i = 0; i < retData.length; i++) {
        if (retData[i].username == input) {
            console.log(retData[i].pub);
            retrievePubLocation(retData[i].postcode);
        }
    }
}


function addMarker(lat, lon) {

    var layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [
                new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat]))
                })
            ]
        })
    });
    map.addLayer(layer);

}