function makeDirectionsLink(coords){

    return `<a href="https://www.google.com/maps/dir/?api=1&destination=${coords.lat}%2C${coords.lng}" class="button button-white">Get Directions</a>`;
}

const mapStyles = [
    {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
    },
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#181818"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1b1b1b"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#2c2c2c"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#8a8a8a"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#373737"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#3c3c3c"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#4e4e4e"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#3d3d3d"
            }
        ]
    }
];

const pins = [

    {
        title: "Kedleston Road Campus",
        description: '<span class="h3">Kedleston Road</span><p>Kedleston Road is our biggest site, with a lively atmosphere - the huge Atrium space hosts markets and one-off events through the year. This site is also where you’ll find the Sports Centre, main library, Union of Students, shops and food outlets. Business, Education, Health, Humanities, Journalism and Science courses are taught at Kedleston Road.</p>',
        position: {
            lat: 52.93806276314859,
            lng: -1.497197859525484
        }
    },


    {
        title: "Derby Theatre",
        description: "<span class=\"h3\">Derby Theatre</span><p>If you’re studying Theatre Arts, you’ll be based at our very own Derby Theatre, where you can get involved in all aspects of performance and production. </p>",
        position: {
            lat: 52.92035675976207,
            lng: -1.471438472972772
        }
    },
    {
        title: "One, Friar Gate Square",
        description: '<span class=\"h3\">One, Friar Gate Square</span><p>This striking building in the city is the base for our Criminology, Law, Policing and Social Sciences courses.</p>',
        position: {
            lat: 52.92496534231514,
            lng: -1.4845642
        }
    },
    {
        title: "Markeaton Street",
        description: "<span class=\"h3\">Markeaton Street</span><p>It’s all about innovation and creativity at Markeaton Street. This is home to our Engineering, Computing and Mathematics courses, as well as Art, Design Media and Photography. Fashion and Textiles students are based in the Chandos Pole Street facility, right next door.</p>",
        position: {
            lat: 52.931064956532225,
            lng: -1.4966564474118058
        }
    },
    {
        title: 'Britannia Mill',
        description: '<span class=\"h3\">Britannia Mill</span><p>This restored former textile mill is a creative space, with studios for Illustration, Interior Design and Fine Art.</p>',
        position: {
            lat: 52.92852746243776,
            lng: -1.494102999666393
        }
    }
];

const initialLocation = {
    lat: 52.92706350859449,
    lng: -1.4784612948937237
}

const styles = {
    default: [],
    hide: [
        {
            featureType: "poi.business",
            stylers: [{ visibility: "off" }],
        },
        {
            featureType: "transit",
            elementType: "labels.icon",
            stylers: [{ visibility: "off" }],
        },
    ],
};

function initMap() {
    let svgMarker = "/media/derbyacuk/assets/study/undergraduate/prospectus/make-it-real-map-pin.png";
    // The location of Uluru
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: initialLocation,
        streetViewControl: false,
        mapTypeControl: false,
        styles: mapStyles,
    });

    pins.forEach(pin => {
        const infowindow = new google.maps.InfoWindow({
            content: pin.description + makeDirectionsLink(pin.position),
        });

        const marker = new google.maps.Marker({
            position: pin.position,
            icon: svgMarker,
            map: map,
            label: {
                text: pin.title,
                className: 'map-label',
            }
        });

        marker.addListener("click", () => {
            infowindow.open({
                anchor: marker,
                map,
                shouldFocus: true,
            });
        });
    });
}

let mapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDe37X9s1NR69Kjt4sv56G0agdWFNgNcbc&callback=initMap&libraries=&v=weekly";
let mapsElement = document.createElement("script");
mapsElement.setAttribute('src', mapsUrl);
document.body.appendChild(mapsElement);