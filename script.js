// Initialize Bootstrap tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
});

// Add active class to flight type buttons when clicked
document.querySelectorAll('.flight-type-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        this.parentElement.querySelectorAll('.flight-type-btn').forEach(b => {
            b.classList.remove('active');
        });
        this.classList.add('active');
    });
});

// Popular destinations with their names
const popularDestinations = [
    'Paris',
    'Tokyo',
    'New York',
    'London',
    'Dubai, U.A.E',
    'Toronto',
    'Istanbul',
    'Maldives',
    'kuala lumpur',
    'Abu Dhabi',
    'Singapore',
    'Doha'
];

async function getCityImage(city) {
    try {
        const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(city)} city&per_page=1`, {
            headers: {
                Authorization: 'dXOfqX69O6ICLYG81ERMm7ytOlY22bjqDGtDKxwsLRIjIhlIWvPCUjPn' // Replace with your actual Pexels API key
            }
        });
        
        if (!res.ok) {
            throw new Error('API request failed');
        }
        
        const data = await res.json();
        if (data.photos && data.photos.length > 0) {
            return {
                name: city,
                image: data.photos[0].src.large
            };
        }
    } catch (err) {
        console.error('Error fetching image for', city, ':', err);
    }
    return {
        name: city,
        image: `https://source.unsplash.com/random/600x400/?${encodeURIComponent(city)}`
    };
}

function setDefaultDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    document.getElementById('departure').valueAsDate = today;
    document.getElementById('return-date').valueAsDate = nextWeek;
    document.getElementById('departure2').valueAsDate = today;
    document.getElementById('return-date2').valueAsDate = tomorrow;
}

async function updateDestinationCards() {
    const cards = document.querySelectorAll('.card');
    
    // Fetch images for all destinations first
    const destinationsWithImages = await Promise.all(
        popularDestinations.map(city => getCityImage(city))
    );
    
    // Update each card with the corresponding city data
    cards.forEach((card, index) => {
        if (destinationsWithImages[index]) {
            const cityName = card.querySelector('.card-text');
            if (cityName) {
                cityName.textContent = destinationsWithImages[index].name;
            }
            
            const img = card.querySelector('.card-img-top');
            if (img) {
                img.src = destinationsWithImages[index].image;
                img.alt = destinationsWithImages[index].name;
            }
        }
    });
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async function (position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                    if (!response.ok) {
                        throw new Error('Geocoding API request failed');
                    }
                    
                    const data = await response.json();
                    const city = data.address.city || data.address.town || data.address.village || 'your area';
                    
                    document.querySelector('.locationdiv h3').textContent = `Best destinations from ${city}`;
                    
                    // Update the cards with popular destinations
                    await updateDestinationCards();
                } catch (error) {
                    console.error('Error fetching location data:', error);
                    handleFallback();
                }
            },
            function (error) {
                console.error('Error getting location:', error);
                handleFallback();
            }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
        handleFallback();
    }
}

async function handleFallback() {
    document.querySelector('.locationdiv h3').textContent = 'Best destinations';
    await updateDestinationCards();
}

window.addEventListener('DOMContentLoaded', () => {
    setDefaultDates();
    getUserLocation();
});
// Add event listener to login button
document.querySelector('.login-btn button').addEventListener('click', function(e) {
    e.preventDefault();
    var authModal = new bootstrap.Modal(document.getElementById('authModal'));
    authModal.show();
});

// Form submission handlers
document.querySelector('#login form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    // Add your login logic here
    console.log('Login form submitted');
});

document.querySelector('#signup form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    // Add your signup logic here
    console.log('Signup form submitted');
    // You can switch to login tab after successful signup
    // var signupTab = new bootstrap.Tab(document.querySelector('#login-tab'));
    // signupTab.show();
});
