var mylong
var mylat


/*
    called on form submit
    get data from APIs and place results in either a table or Google Map
*/

function display(){    

    //document.getElementById("magSort").value = "off"
    
    var staticURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
    

    // geocode
    var mapsURLBase = "https://maps.googleapis.com/maps/api/geocode/json?address="
    var mapsAPIKey = "&key=AIzaSyCC9UKV-RIkf01i_oZdYRrIOto_t7Z3irk"

    // old key:
    //var mapsAPIKey = "&key=AIzaSyBsC1WKjKATvdB_5YinmZFnGAJd5x7LiPg"

    var quakeInfo = document.getElementById("data")     
    
    
    var magChecked = document.getElementById("Magnitude").checked
    var placeChecked = document.getElementById("Place").checked
    var timeChecked = document.getElementById("Time").checked
    var coorChecked = document.getElementById("Longitude/Latitude").checked
    

    /*
    var magChecked = true
    var placeChecked = true
    var timeChecked = true
    var coorChecked = true
    */


    var magSort = (document.getElementById("magSort").value == "on")
    var timeSort = (document.getElementById("timeSort").value == "on")
    var longSort = (document.getElementById("longSort").value == "on")
    var latSort = (document.getElementById("latSort").value == "on")
    var distSort = (document.getElementById("distSort").value == "on")
    var about = (document.getElementById("about").value == "on")
        
    var city = document.getElementById("city").value
    
    var ascSort = document.getElementById("ascending").checked
    var decSort = document.getElementById("descending").checked
        
    var mapChecked = document.getElementById("mapview").checked
    var tblChecked = document.getElementById("tableview").checked


    // # quakes user requests
    var n = parseInt( $( '#numbero' ).val() )
    console.log(n)
    
    
    city.replace(" ", "+")
    
    var asc = -1
    if (ascSort){
        asc = 1
    } 
    
    document.getElementById("data").innerHTML = ""
    
    
    if (about == true){
        quakeInfo.innerHTML += "Please Choose an Attribute to Sort By"
        return
    }
    
    
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
        
    if (document.getElementById("numbero").value == ""){
            quakeInfo.innerHTML += "Please Enter the Number of Quakes to Fetch."
            return
    }

    
    var quakeList = []
    var markers = []
        
    
    
    $.getJSON(staticURL, function(data) {
        var features = data["features"]
        var featuresLen = Object.keys(features).length
        if (featuresLen > 100){
            featuresLen = 100
        }
        
        for (i = 0; i < featuresLen; i++){ // data.length for whole
            if (features[i] != null) {
                try {
                    var quake = {
                        'mag': (data["features"][i]["properties"]["mag"]).toFixed(2), 
                        'place': (data["features"][i]["properties"]["place"]),
                        'time': (new Date(data["features"][i]["properties"]["time"])).toString(),
                        'timenum': data["features"][i]["properties"]["time"],
                        'long': (data["features"][i]["geometry"]["coordinates"][0]).toFixed(2),
                        'lat': (data["features"][i]["geometry"]["coordinates"][1]).toFixed(2),
                        'dist': (getDist(mylat, data["features"][i]["geometry"]["coordinates"][1], mylong, data["features"][i]["geometry"]["coordinates"][0])).toFixed(2)
                    }
                } catch (error) {
                    console.log(error)
                }
            }
                
            quakeList.push(quake)
        }
        
        if (n > quakeList.length){
            n = quakeList.length
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
        
        thead.innerHTML = ""
        tbody.innerHTML = ""
        
        
        var head = ""
        var body = ""
        

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
  document.getElementById("about").value = "off"
    
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

