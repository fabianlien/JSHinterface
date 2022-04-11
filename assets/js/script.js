const API_KEY = "OaN5I9yOmRqAmqzOoTIT27FBTvg";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

/** Event Listeners */
document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

/** Gets the status of the users API key from the API*/
async function getStatus(e) {
    let queryString = `${API_URL}?api_key=${API_KEY}`;
    let response = await fetch(queryString);
    let data = await response.json();

    if (response.ok) {
        displayStatus(data.expiry);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
}

/** Called by getStatus(). Overwrites HTML in bootstrap modal and shows modal */
function displayStatus(keyExpiry) {
    document.getElementById("resultsModalTitle").innerText = "API Key Status";
    document.getElementById("results-content").innerHTML = `Your key is valid until<br>${keyExpiry}`
    resultsModal.show();
}

/** Posts the form to the API and calls displayErrors if ok */
async function postForm(e) {
    let response = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                                "Authorization": API_KEY,
                        },
                        body: formOptions(new FormData(document.getElementById("checksform"))),
    })
    let data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
}

/**  Overwrites HTML in bootstrap modal and shows modal  */
function displayErrors(data) {
    let heading = `JSHInt Results for ${data.file}`

    if (data.total_errors === 0) {
        results = `<div class="no-errors">No Errors found, hooray!</div>`
    } else {
        results = `<div class="errors"><strong>JSHint found ${data.total_errors} errors.</strong><hr></div>`
        for (let error of data.error_list) {
            results += `<div><br>At line ${error.line}, column ${error.col}:<br>${error.error}<br></div>`
        }
    }
    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}

/** Changes the options form data from seperate items to a list seperated by commas */
function formOptions(form) {
    let optArray = [];
    for (let entry of form.entries()) {
        if (entry[0] === "options") {
            optArray.push(entry[1]);
        }
    }
    form.delete("options");
    form.append("options", optArray.join());

    return form;
}

function displayException(error) {
    console.log(error);
    document.getElementById("resultsModalTitle").innerText = "An Exception Occurred";
    document.getElementById("results-content").innerHTML = `The API returned status code ${error.status_code}<br>Error number: <strong>${error.error_no}</strong><br>Error text: <strong>${error.error}</strong>`;
    resultsModal.show();
}