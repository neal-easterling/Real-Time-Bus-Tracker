console.log('mapanimation.js connected');
const busURL = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';

let map;

const getLocations = async ()=>{
  const response = await fetch(busURL);
  const json = await response.json();
  return json.data;
};

const busMarkers =[];

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

  map = new Map(document.getElementById("map"), {
    center: { lat: 42.355001, lng: -71.099003 },
    zoom: 14,
    mapTypeId: "satellite", 
    mapId: 'DEMO_MAP_ID',
    disableDefaultUI: true,
    zoomControl: true,
  });
  map.setTilt(45);

  const handleMarkers = async ()=>{
    let locations = await getLocations();
    while(busMarkers.length > 0){
      let bus = busMarkers.pop();
      bus.position = null;
    }
    const busIcon = document.createElement('img');
    busIcon.src = './bus-icon.svg';
    const pinElement = new PinElement({
      glyph: busIcon
    });
   
    locations.forEach((location)=>{
      const busIcon = document.createElement('img');
      busIcon.src = './bus-icon.svg';
      const pinElement = new PinElement({
        glyph: busIcon,
        scale: 1.5,
        background: '#257FD2',
        borderColor: '#d9d9d9'
      });
      
      const marker = new AdvancedMarkerElement({
        map,
        position: {lat: location.attributes.latitude, lng: location.attributes.longitude},
        content: pinElement.element,
        title: location.attributes.label, 
      });
      busMarkers.push(marker);
    });
    console.log('handler called');
    setTimeout(handleMarkers, 15000);
  }
  handleMarkers();  
}

initMap();










