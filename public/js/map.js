mapboxgl.accessToken = mapToken;
//console.log(mapToken)
const map = new mapboxgl.Map({
container : 'map', // container ID
center: listings.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
zoom: 9 // starting zoom
});

console.log(listings.geometry.coordinates)

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listings.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 })
      .setHTML(`<h4>${listings.title}</h4> <p>Exact location provided after booking`)
      .setMaxWidth("200px")  // This should be chained to Popup, not Marker
  )
  .addTo(map);
