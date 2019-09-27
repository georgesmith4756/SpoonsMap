const pubTable = document.getElementById("pubTable");
let userEntryCount = 0;
let totalPubCount = 0;
let userPubCount = 0;

var map = new ol.Map({
    target: "map",
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

function getEntries(data) {
    let retData = JSON.parse(data);

    
    input = document.getElementById("enteredEmail").value;

    for (i = 0; i < retData.length; i++) {
        if (retData[i].username == input) {
            retrievePubLocation(retData[i].postcode);
            userEntryCount += 1;
        }
    }

    document.getElementById("entryText").innerHTML = "You have " + userEntryCount + " logged purchases";
    document.getElementById("pubText").innerHTML = "There are currently " + totalPubCount + " Wetherspoons in the UK and Ireland";

    
}

function retrievePubsVisited() {
    const mapLayers = [...map.getLayers().getArray()];
    for(let i = 1; i < mapLayers.length; i++){
        map.removeLayer(mapLayers[i]);
    }

    userEntryCount = 0;

    let method = "GET";
    let url = "http://35.204.239.92:9000/pubs";
    let callback = getEntries;
    let headers = {
        "Accept": "application/json;charset=UTF-8",
    }
    httpRequest(method, url, callback, headers);
    

}



function retrievePubLocation(postcode) {
    let method = "GET";
    let url = "http://35.204.239.92:8000/postcodes/" + postcode;
    let callback = getLatLon;
    let headers = {
        "Accept": "application/json;charset=UTF-8",
    }
    httpRequest(method, url, callback, headers);


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

function getLatLon(data) {
    let retData = JSON.parse(data);


    addMarker(retData.result.latitude, retData.result.longitude);

}



function getTotalPubCount(){
    var json;
    var xhr = new XMLHttpRequest();
    var url = "http://35.204.239.92:9000/pubcount";
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = () => {

        if (xhr.readyState === 4 && xhr.status === 200) {
            json = JSON.parse(xhr.responseText);

            
            totalPubCount = json;

            
        
            }
    }

    

    

    xhr.send();
    return json;

 }

 async function newTableEntries(table){
    let row = document.createElement("tr");
    for( let i =1; i <arguments.length;i++){
        let box = document.createElement("td");
        box.innerHTML = arguments[i];
        row.appendChild(box);
    }
    table.appendChild(row);
 }


function getAllPubs() {

    getTotalPubCount();
   

    var json;
    var xhr = new XMLHttpRequest();
    var url = "http://35.204.239.92:9000/publist";
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = () => {

        if (xhr.readyState === 4 && xhr.status === 200) {
            json = JSON.parse(xhr.responseText);
        
            
    
        for(let i=0;i<json.length;i++){
            let temp = json[i];
            newTableEntries(pubTable,temp["pub"], temp["id"]);
        }
    }
    }

    xhr.send();
    return false;
}





 function getEntryCount(){
    var json;
    var xhr = new XMLHttpRequest();
    var url = "http://35.204.239.92:9000/entrycount";
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = () => {

        if (xhr.readyState === 4 && xhr.status === 200) {
            json = JSON.parse(xhr.responseText);

           userPubCount = json;
            
        
    }
    }

    xhr.send();
    return json;

 }

 function addPub() {

    let pubName = {pub: document.getElementById("modalPubText").value};

    let stringPub = JSON.stringify(pubName);

    let method = "POST";
    let url = "http://35.204.239.92:9000/publist";
    let callback = successfulAdd;
    let headers = {
        "Content-Type": "application/json",
    }
    httpRequest(method, url, callback, headers, stringPub);
    

}

function updatePub(){
    let pubName = {pub: document.getElementById("modalNewPubName").value};
    let pubID = document.getElementById("modalOldPubID").value;
    let stringPub = JSON.stringify(pubName);

    let method = "PUT";
    let url = "http://35.204.239.92:9000/publist/" + pubID;
    let callback = successfulAdd;
    let headers = {
        "Content-Type": "application/json",
    }
    httpRequest(method, url, callback, headers, stringPub);

}

function deletePub(){
    let pubID = document.getElementById("pubUpdateID").value;


    let method = "DELETE";
    let url = "http://35.204.239.92:9000/publist/" + pubID;
    let callback = successfulAdd;
    let headers = {
        "Content-Type": "application/json",
    }
    httpRequest(method, url, callback, headers);
    
}

function addVisit(){
    let entry = {pub: document.getElementById("modalEntryPubName").value,
     username: document.getElementById("modalEntryUsername").value, 
     date: document.getElementById("modalEntryDate").value,
      orderTotal: document.getElementById("modalEntryOrderTotal").value,
       postcode: document.getElementById("modalEntryPostcode").value};

    let stringEntry = JSON.stringify(entry);

    let method = "POST";
    let url = "http://35.204.239.92:9000/pubs";
    let callback = successfulAdd;
    let headers = {
        "Content-Type": "application/json",
    }
    httpRequest(method, url, callback, headers, stringEntry);
    
}

function updateVisit(){
    let data = {pub: document.getElementById("modalEntryUpdatePubName").value,
                username: document.getElementById("modalEntryUpdateUsername").value, 
                date: document.getElementById("modalEntryUpdateDate").value,
                orderTotal: document.getElementById("modalEntryUpdateOrderTotal").value,
                postcode: document.getElementById("modalEntryUpdatePostcode").value};

    let visitID = document.getElementById("modalOldVisitID").value
    let stringVisit = JSON.stringify(pubName);

    let method = "PUT";
    let url = "http://35.204.239.92:9000/pubs/" + pubID;
    let callback = successfulAdd;
    let headers = {
        "Content-Type": "application/json",
    }
    httpRequest(method, url, callback, headers, stringVisit);
    
}

function deleteVisit(){
    let visitID = document.getElementById("modalVisitID").value;


    let method = "DELETE";
    let url = "http://35.204.239.92:9000/pubs/" + visitID;
    let callback = successfulAdd;
    let headers = {
        "Content-Type": "application/json",
    }
    httpRequest(method, url, callback, headers);
    
}

function successfulAdd(){
   console.log("successful");
}

function reloadPage(){
    location.reload();
}

function showVisits() {
    const visitTable = document.getElementById("visitTable");
   

    var json;
    var xhr = new XMLHttpRequest();
    var url = "http://35.204.239.92:9000/pubs";
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = () => {

        if (xhr.readyState === 4 && xhr.status === 200) {
            json = JSON.parse(xhr.responseText);
        
            
    
        for(let i=0;i<json.length;i++){
            let temp = json[i];
            newTableEntries(visitTable,temp["pub"],temp["username"],temp["date"],temp["orderTotal"],temp["postcode"],temp["id"]);
        }
    }
    }

    xhr.send();
    return false;
}