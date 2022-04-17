var mylong
var mylat

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
        
    var n = document.getElementById("number").value
    
    // how many to show also
        
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
        
    if (distSort){
        quakeInfo.innerHTML += "Your location: [" + mylong + ", " + mylat + "]<br><br>"
    }
    var quakeList = []
        
    $.getJSON(staticURL, function(data) {
        for (i = 0; i < n; i++){ // data.length for whole
            var quake = {
                'mag': (data["features"][i]["properties"]["mag"]).toFixed(2), 
                'place': (data["features"][i]["properties"]["place"]),
                'time': (new Date(data["features"][i]["properties"]["time"])).toString(),
                'timenum': data["features"][i]["properties"]["time"],
                'long': (data["features"][i]["geometry"]["coordinates"][0]).toFixed(2),
                'lat': (data["features"][i]["geometry"]["coordinates"][1]).toFixed(2),
                'dist': (getDist(mylong, data["features"][i]["geometry"]["coordinates"][0], mylat, data["features"][i]["geometry"]["coordinates"][1])).toFixed(2)
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
             head += `<th>Distance</th>`  
        }
        
        head += `</tr>`
        
        thead.innerHTML += head
        
        
        // this loop needs to be in getJSON
    
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
                body += `<td>${quakeList[i]['long'] + ", " + quakeList[i]['lat']}</td>`
            }
            if (distSort){
                body += `<td>${quakeList[i]['dist']}</td>`
            }
            tbody.innerHTML += body
        }
        
        /*
        for (i = 0; i < n; i++){ // data.length for whole
            str = ""
            if (magChecked == true){
                quakeInfo.innerHTML += ("(" + quakeList[i]['mag'] + ") ").padEnd(10, '.')                
            }
            if (placeChecked == true){
               quakeInfo.innerHTML += (quakeList[i]['place'] + ", ").padEnd(40, '.')
            }
            if (timeChecked == true){
                quakeInfo.innerHTML += quakeList[i]['time'] + ", "
            }
            if (coorChecked == true){
                quakeInfo.innerHTML += "[" + quakeList[i]['long'] + ", " + quakeList[i]['lat'] + "]"
            }
            if (distSort){
                quakeInfo.innerHTML += ", Dist: " + quakeList[i]['dist']
            }
            quakeInfo.innerHTML += "<br>"   
        }
        */
            
    });
          
}


function getDist(x1,x2, y1, y2){
    return Math.sqrt(Math.abs(x2 - x1) * Math.abs(x2 - x1) + Math.abs(y2 - y1) * Math.abs(y2 - y1));
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