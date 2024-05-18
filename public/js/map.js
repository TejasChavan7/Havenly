maptilersdk.config.apiKey = mapToken;
const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.STREETS,
    center: [coordinates[0], coordinates[1]], // Assuming coordinates is an array of [lng, lat]
    zoom: 9
});
const marker = new maptilersdk.Marker({color:"red"})
    .setLngLat([coordinates[0], coordinates[1]]) // Assuming coordinates is an array of [lng, lat]
    .setPopup(new maptilersdk.Popup({offset: 25})
    .setHTML("<h3><p>Exact location is provided after the booking.</p></h3>"))
    .addTo(map);