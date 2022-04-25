var mylong
var mylat

/*
function initMap() {
  // [START maps_add_map_instantiate_map]
  // The location of Uluru
  const uluru = { lat: 37.34, lng: -121.89 };
  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: uluru,
  });
  // [END maps_add_map_instantiate_map]
  // [START maps_add_map_instantiate_marker]
  // The marker, positioned at Uluru
  const marker = new google.maps.Marker({
    position: uluru,
    map: map,
  });
  // [END maps_add_map_instantiate_marker]
}


window.initMap = initMap;
*/


function display(){    
    
    var staticURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
    var mapsURLBase = "https://maps.googleapis.com/maps/api/geocode/json?address="
    var mapsAPIKey = "&key=AIzaSyBsC1WKjKATvdB_5YinmZFnGAJd5x7LiPg"
    var quakeInfo = document.getElementById("data")     
    
    var magChecked = document.getElementById("Magnitude").checked
    var placeChecked = document.getElementById("Place").checked
    var timeChecked = document.getElementById("Time").checked
    var coorChecked = document.getElementById("Longitude/Latitude").checked
        
    //var magSort = (document.getElementById("magsort").activeElement)
    var magSort = (document.getElementById("magSort").value == "on")
    var timeSort = (document.getElementById("timeSort").value == "on")
    var longSort = (document.getElementById("longSort").value == "on")
    var latSort = (document.getElementById("latSort").value == "on")
    var distSort = (document.getElementById("distSort").value == "on")
        
    var city = document.getElementById("city").value//"1600+Amphitheatre+Parkway,+Mountain+View,+CA"  
    //var city = "1600+Amphitheatre+Parkway,+Mountain+View,+CA"
    
    var ascSort = document.getElementById("ascending").checked
    var decSort = document.getElementById("descending").checked
        
    var mapChecked = document.getElementById("mapview").checked
    var tblChecked = document.getElementById("tableview").checked
    
    //var n = (document.getElementById("numbero").value)
    var n = parseInt( $( '#numbero' ).val() )
    var nf = 100    
    
    
    city.replace(" ", "+")
    
    var asc = -1
    if (ascSort){
        asc = 1
    } 
        
    document.getElementById("data").innerHTML = ""
    
    
    
    
    if (city == false && distSort == true){
        quakeInfo.innerHTML += "Please Enter a City Name"
        return
    }
    
    var mapsURL = mapsURLBase + city + mapsAPIKey

    $.ajaxSetup({
        async: false
    });
    
    $.getJSON(mapsURL, function(data){
        mylong = data["results"][0]["geometry"]["location"]["lng"]
        mylat = data["results"][0]["geometry"]["location"]["lat"]
    }); 
    
    
    if (distSort){
        if (mylat == null || mylong == null){
            quakeInfo.innerHTML += "Place was not Valid"
            return
        }
    }
        
    //if (distSort){
    //    quakeInfo.innerHTML += "Your Location: [" + mylat.toFixed(2) + ", " + mylong.toFixed(2) + "]<br><br>"
    //}
    
    /*
    if (distSort){
        quakeInfo.innerHTML += n//"Your Location: [" + mylat.toFixed(2) + ", " + mylong.toFixed(2) + "]<br><br>"
    }
    */
    var quakeList = []
    var markers = []
        
    //n = 5
    //nfind = 100
    
    
    $.getJSON(staticURL, function(data) {
        for (i = 0; i < nf; i++){ // data.length for whole
            var quake = {
                'mag': (data["features"][i]["properties"]["mag"]).toFixed(2), 
                'place': (data["features"][i]["properties"]["place"]),
                'time': (new Date(data["features"][i]["properties"]["time"])).toString(),
                'timenum': data["features"][i]["properties"]["time"],
                'long': (data["features"][i]["geometry"]["coordinates"][0]).toFixed(2),
                'lat': (data["features"][i]["geometry"]["coordinates"][1]).toFixed(2),
                'dist': (getDist(mylat, data["features"][i]["geometry"]["coordinates"][1], mylong, data["features"][i]["geometry"]["coordinates"][0])).toFixed(2)
            }
                
            quakeList.push(quake)
        }
            
        if (magSort){
            quakeList.sort(function(a,b){
                return (a['mag'] - b['mag']) * asc;
            })
        }
            
        if (timeSort){ // use timenum
            quakeList.sort(function(a,b){
                return (a['timenum'] - b['timenum']) * asc;   
            })
        }
            
        if (longSort){
            quakeList.sort(function(a,b){
                return (a['long'] - b['long']) * asc;
            })
        }
            
        if (latSort){
            quakeList.sort(function(a,b){
                return (a['lat'] - b['lat']) * asc;
            })
        }
        if (distSort){
            quakeList.sort(function(a,b){
                return (a['dist'] - b['dist']) * asc;
            })
        } 

        const thead = document.querySelector("thead");
        const tbody = document.querySelector("tbody");
        //document.getElementById("quakeTable").style.borderspacing = "15px"
        
        thead.innerHTML = ""
        tbody.innerHTML = ""
        
        
        var head = ""
        var body = ""
        
        //n = parseInt(document.getElementById("numbero"))
        //quakeInfo.innerHTML += n//document.getElementById("number").value   
        if (mapChecked){
        
            document.getElementById("map").style.visibility = "visible";
            const uluru = { lat: mylat, lng: mylong };
    
        
            const map = new google.maps.Map(document.getElementById("map"), {
                zoom: 2,
                center: uluru,
            });
                
            markers[0] = new google.maps.Marker({
                position: uluru,
                map: map,
            });
            
            var infowindow = new google.maps.InfoWindow({
                content: 'YOU'
            });
            
            infowindow.open(map, markers[0]);
                google.maps.event.addListener(markers[0], 'click', function () {
                alert(markers[this.id].description)
            });
        
            
            for (i = 1; i < (n + 1); i++){
                var pos = new google.maps.LatLng(quakeList[i-1]['lat'], quakeList[i-1]['long'])
            
                markers[i] = new google.maps.Marker({
                    position: pos,
                    map,
                });
            
                var infowindow = new google.maps.InfoWindow({
                    content: quakeList[(i - 1)]['place']
                });
            
                infowindow.open(map, markers[i]);
                    google.maps.event.addListener(markers[i], 'click', function () {
                        alert(markers[this.id].description)
                    })
            }
            
            //map = map.setCenter(mylat, mylong, 2);
            
        }
        
        if (tblChecked){
        
            document.getElementById("map").style.visibility = "hidden";
            head += `<tr>`
        
            if (magChecked == true){
                head += `<th>Magnitude</th>`
            }
         
            if (placeChecked == true){
                head += `<th>Location</th>`
            }
            
            if (timeChecked == true){
                head += `<th>Time</th>`
            }
        
            if (coorChecked == true){
                head += `<th>Coordinates</th>`
            }
         
            if (distSort){
                head += `<th>Distance (km)</th>`  
            }
        
            head += `</tr>`
        
            thead.innerHTML += head
            
            for (i = 0; i < n; i++){ // data.length for whole
                body = ""
                body += `<tr>`
                if (magChecked == true){
                    body += `<td>${quakeList[i]['mag']}</td>`
                }
                if (placeChecked == true){
                    body += `<td>${quakeList[i]['place']}</td>`
                }
                if (timeChecked == true){
                    body += `<td>${quakeList[i]['time']}</td>`
                }
                if (coorChecked == true){
                    //body += `<td>${"[" + quakeList[i]['long'] + ", " + quakeList[i]['lat'] + "]"}</td>`
                    body += `<td>${quakeList[i]['lat'] + ", " + quakeList[i]['long']}</td>`
                }
                if (distSort){
                    body += `<td>${quakeList[i]['dist']}</td>`
                }
                tbody.innerHTML += body
            
            }
        }

    });
          
    
    
}

// x = lat, y = long

function getDist(x1,x2, y1, y2){

    var R = 6371;
    var l1 = x1 * Math.PI/180;
    var l2 = x2 * Math.PI/180;
    var dl = (x2 - x1) * Math.PI/180;
    var dr = (y2 - y1) * Math.PI/180;
    
    var a = Math.sin(dl/2) * Math.sin(dl/2) + Math.cos(l1) * Math.cos(l2) * Math.sin(dr/2) * Math.sin(dr/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c;
    
}
    
function gotdata(data){
    mapsdata = data;
}    


function openCity(evt, cityName) {
  var i, tabcontent, tablinks;
  document.getElementById("magSort").value = "off"    
  document.getElementById("timeSort").value = "off"
  document.getElementById("longSort").value = "off"
  document.getElementById("latSort").value = "off"
  document.getElementById("distSort").value = "off"    
    
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
   
  document.getElementById(cityName).value = "on"
}

function pad(str, len){
    var i = str.length
    while (i < len){
        str += "&nbsp"
        i++
    }
    return str
}
