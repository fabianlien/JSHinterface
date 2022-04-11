const API_KEY = "OaN5I9yOmRqAmqzOoTIT27FBTvg";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e))

async function getStatus(e) {
    let queryString = `${API_URL}?api_key=${API_KEY}`;
    let response = await fetch(queryString);
    let data = await response.json();

    if (response.ok) {
        displayStatus(data.expiry)
    } else {
        throw new Error(data.error)
    }
}

function displayStatus(keyExpiry) {
    document.getElementById("resultsModalTitle").innerText = "API Key Status";
    document.getElementById("results-content").innerHTML = `Your key is valid until<br>${keyExpiry}`
    resultsModal.show();
}