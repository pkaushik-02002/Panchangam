// Toggle the navigation menu for mobile view
document.getElementById('burger').addEventListener('click', function() {
    var navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('active');
});

// Function to load Panchangam data from JSON file
async function loadPanchangamData() {
    try {
        const response = await fetch('data/panchangam_data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Loaded data:', data); // Log the loaded data for debugging
        return data;
    } catch (error) {
        console.error("Error loading Panchangam data:", error);
        document.getElementById('horoscope-result').innerHTML = `<p>Error loading data. ${error.message}</p>`;
        document.getElementById('animal-match-result').innerHTML = `<p>Error loading data. ${error.message}</p>`;
        return null;
    }
}

// Function to calculate horoscope compatibility
function calculateHoroscope() {
    const brideNakshatram = document.getElementById('bride-nakshatram').value;
    const brideRashi = document.getElementById('bride-rashi').value;
    const groomNakshatram = document.getElementById('groom-nakshatram').value;
    const groomRashi = document.getElementById('groom-rashi').value;

    loadPanchangamData().then(data => {
        if (!data) {
            document.getElementById('horoscope-result').innerHTML = `<p>Error loading data.</p>`;
            return;
        }

        const score = calculateGunaMilan(brideNakshatram, groomNakshatram, brideRashi, groomRashi, data);

        document.getElementById('horoscope-result').innerHTML = `
            <p>Guna Milan Score: ${score.totalScore} (out of 36)</p>
            <p>Compatibility: ${getCompatibilityDescription(score.totalScore)}</p>
            <p>Details:</p>
            <ul>
                ${score.details.map(detail => `<li>${detail.description}: ${detail.points} (Reference: ${detail.reference})</li>`).join('')}
            </ul>
        `;
    });
}

// Function to calculate Guna Milan score based on Nakshatras and Rashis
function calculateGunaMilan(brideNakshatram, groomNakshatram, brideRashi, groomRashi, data) {
    let totalScore = 0;
    let details = [];

    // Nakshatra compatibility
    if (data.nakshatra_compatibility[brideNakshatram] && data.nakshatra_compatibility[brideNakshatram][groomNakshatram]) {
        const nakshatraScore = data.nakshatra_compatibility[brideNakshatram][groomNakshatram].score;
        const reference = data.nakshatra_compatibility[brideNakshatram][groomNakshatram].reference;
        totalScore += nakshatraScore;
        details.push({ description: `Nakshatra Compatibility (${brideNakshatram} & ${groomNakshatram})`, points: nakshatraScore, reference: reference });
    }

    // Rashi compatibility
    if (data.rashi_compatibility[brideRashi] && data.rashi_compatibility[brideRashi][groomRashi]) {
        const rashiScore = data.rashi_compatibility[brideRashi][groomRashi].score;
        const reference = data.rashi_compatibility[brideRashi][groomRashi].reference;
        totalScore += rashiScore;
        details.push({ description: `Rashi Compatibility (${brideRashi} & ${groomRashi})`, points: rashiScore, reference: reference });
    }

    // Additional checks (if any) can be added here

    return { totalScore, details };
}

// Function to get compatibility description based on score
function getCompatibilityDescription(score) {
    if (score >= 30) {
        return "Highly Compatible";
    } else if (score >= 20) {
        return "Moderately Compatible";
    } else {
        return "Low Compatibility";
    }
}

// Function to check animal compatibility
function checkAnimalMatch() {
    const brideAnimal = document.getElementById('bride-animal').value;
    const groomAnimal = document.getElementById('groom-animal').value;

    loadPanchangamData().then(data => {
        if (!data) {
            document.getElementById('animal-match-result').innerHTML = `<p>Error loading data.</p>`;
            return;
        }

        if (data.animal_compatibility[brideAnimal] && data.animal_compatibility[brideAnimal][groomAnimal]) {
            const compatibility = data.animal_compatibility[brideAnimal][groomAnimal].compatibility;
            const reference = data.animal_compatibility[brideAnimal][groomAnimal].reference;
            document.getElementById('animal-match-result').innerHTML = `<p>Animal Match Result: ${compatibility} (Reference: ${reference})</p>`;
        } else {
            document.getElementById('animal-match-result').innerHTML = `<p>No data available for this combination.</p>`;
        }
    });
}
