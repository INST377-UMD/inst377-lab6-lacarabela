function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}

function generateRandomCoordinates() {
    const coordinates = [];
    for (let i = 0; i < 3; i++) {
        const lat = getRandomInRange(30, 35, 3);
        const lng = getRandomInRange(-90, -100, 3); 
        coordinates.push([lat, lng]);
    }
    return coordinates;
}

async function generateMarkerText(coord, index) {
    let p = `Marker ${index + 1}: Latitude: ${coord[0]}, Longitude: ${coord[1]}\n`;
    
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coord[0]}&longitude=${coord[1]}&localityLanguage=en`);
    const data = await response.json();
    p += `Locality: ${data.locality}`;

    return p;
}

async function initMap() {
    var map = L.map('map').setView([32, -98.5795], 4);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Generate and add random markers
    const coordinates = generateRandomCoordinates();
    const markerList = document.getElementById('marker-list');

    for (const [index, coord] of coordinates.entries()) {
        L.marker(coord).addTo(map)
            .bindTooltip(`Marker ${index + 1}`, {
                permanent: false,
                direction: 'top',
                opacity: 0.7
            });

        // Generate marker text under the map
        const markerText = await generateMarkerText(coord, index);
        const p = document.createElement('p');
        p.textContent = markerText;
        markerList.appendChild(p);
    }
}

initMap();
