// MAIN Variables

const chamberSelection = { state: 'ALL', party: [] };
const partyCounter = { R: 0, D: 0, I: 0 };

let filtersTimer = undefined;

// ----------- Functions ------------

// ----------------------------------
// Table manipulation Functions

let createChamberCell = (content) => {
    let cell = document.createElement("td");
    cell.innerHTML = content;
    return cell;
};

let createNameCell = (name, url) => {
    let cell = document.createElement("td");
    let link = document.createElement("a");

    link.innerHTML = name;
    link.setAttribute('title', name);
    link.setAttribute('href', url);
    link.setAttribute('target', '_blank');
    cell.append(link);
    return cell;

};

let createChamberRow = (item) => {
    let tRow = document.createElement("tr");
    let newCell = Object;
    let fullName = item.first_name + " ";
    fullName += item.middle_name === null ? "" : item.middle_name + " ";
    fullName += item.last_name;
    if (item.url.length === 0 || item.url == null) {
        newCell = createChamberCell(fullName);
    } else {
        newCell = createNameCell(fullName, item.url);
        tRow.setAttribute('data-href', item.url);
    }
    tRow.append(newCell);
    newCell = createChamberCell(item.party); // Party
    tRow.append(newCell);
    newCell = createChamberCell(item.state); // State
    tRow.append(newCell);
    newCell = createChamberCell(item.seniority); // Seniority
    tRow.append(newCell);
    newCell = createChamberCell(item.votes_with_party_pct + '%'); // Votes with Party (percentage)
    tRow.append(newCell);
    return tRow;
};

// ---------------------------
// Update Table Functions 

let updateTable = () => {

    let contentTab = document.getElementById("chamber-info");
    for (let node of contentTab.childNodes) {
        if (node.nodeType === 1 && node.nodeName === 'TR') {
            if (chamberSelection.state === 'ALL') {
                if (chamberSelection.party.includes(node.children[1].innerHTML)) {
                    node.style.display = "";
                } else {
                    node.style.display = "none";
                }
            } else if (node.children[2].innerHTML === chamberSelection.state) {
                if (chamberSelection.party.includes(node.children[1].innerHTML)) {
                    node.style.display = "";
                } else {
                    node.style.display = "none";
                }
            } else {
                node.style.display = "none";
            }
        }
    }
};

let stateUpdateTable = (selState) => {

    chamberSelection.state = selState;
    if (selState === 'ALL') {
        if (chamberSelection.party.length == 0) {
            if (filtersTimer === undefined) {
                // console.log('SET TIMER');
                filtersTimer = setTimeout(function() {
                    partyInitFilters(partyCounter);
                    updateTable();
                    filtersTimer = undefined;
                }, 1500);
            }
        }
    } else {
        if (filtersTimer !== undefined) {
            clearTimeout(filtersTimer);
            filtersTimer = undefined;
        }
    }
    updateTable();
};

let partyUpdateTable = (selList) => {
    const selTab = [];

    if (document.getElementById("gopSel").checked) {
        //console.log('GOP Checked');
        selTab.push('R');
    }
    if (document.getElementById("demSel").checked) {
        //console.log('DEM Checked');
        selTab.push('D');
    }
    if (document.getElementById("indSel").checked) {
        //console.log('IND Checked');
        selTab.push('I');
    }
    chamberSelection.party = selTab;
    if (selTab.length == 0 && chamberSelection.state === 'ALL') {
        if (filtersTimer === undefined) {
            // console.log('SET TIMER');
            filtersTimer = setTimeout(function() {
                partyInitFilters(partyCounter);
                updateTable();
                filtersTimer = undefined;
            }, 1500);
        }
    } else {
        if (filtersTimer !== undefined) {
            clearTimeout(filtersTimer);
            filtersTimer = undefined;
        }
        updateTable();
    }
};

// ---------------------------------
// Init table and filter Functions

let stateInitFilter = (statesList) => {
    statesList.sort().unshift('ALL');

    let menuElem = document.getElementById("state-select");
    // console.dir(menuElem);
    let optElem = Object;

    for (let idx = 0; idx < statesList.length; idx++) {
        optElem = document.createElement("option");
        optElem.innerHTML = statesList[idx];
        optElem.value = statesList[idx];
        // optElem.href = "#";
        // optElem.id = "STATE-" + statesList[idx];
        // optElem.classList.add('dropdown-item');
        menuElem.append(optElem);
    }
};

let partyInitFilters = (partyCount) => {
    const selTab = [];

    if (partyCount.R > 0) {
        document.getElementById("gopSel").checked = true;
        selTab.push('R');
    } else {
        document.getElementById("gopSel").checked = false;
        document.getElementById("gopSel").disabled = true;
    }
    if (partyCount.D > 0) {
        document.getElementById("demSel").checked = true;
        selTab.push('D');
    } else {
        document.getElementById("demSel").checked = false;
        document.getElementById("demSel").disabled = true;
    }
    if (partyCount.I > 0) {
        document.getElementById("indSel").checked = true;
        selTab.push('I');
    } else {
        document.getElementById("indSel").checked = false;
        document.getElementById("indSel").disabled = true;
    }
    chamberSelection.party = selTab;
};

let InitTable = (data) => {
    let statesList = [];

    const tBody = document.querySelector('tbody');

    for (item of data.results[0].members) { // Update Chamber Table
        if (!statesList.includes(item.state)) { // Update States List
            statesList.push(item.state);
        }
        partyCounter[item.party] = partyCounter[item.party] + 1;
        tBody.append(createChamberRow(item));
    }
    partyInitFilters(partyCounter);
    stateInitFilter(statesList);
    updateTable();
};


// For Senate/House pages -------------

$(document).ready(function() {

    // ----------------------------
    // Filter Events Handlers

    // State Filter Handler

    let observableElem = document.getElementById('state-select');
    observableElem.onchange = function(event) {
        stateUpdateTable(event.currentTarget.value);
        //console.log("B EVENT", event.currentTarget.value);
    };

    // Party filters Handler

    observableElem = document.getElementById('party-select');
    observableElem.onclick = function(event) {
        partyUpdateTable(document.querySelectorAll(".form-check-input"));
    };

    // ----------- Main Part ------------

    // Manage Title/Description area

    elem = document.getElementById("content-title");
    if (elem != null) {
        elem.onclick = () => {
            const imgElem = document.getElementById("content-title-arrow");
            if (imgElem.currentSrc.indexOf('up.svg') === -1) {
                imgElem.setAttribute('src', '../resources/icon-arrow-up.svg');
          |?/"
          '|;.p;.op[
              
            "      imgElem.setAttribute('srcset', '../resources/icon-arrow-up.svg');
            } else {
                imgElem.setAttribute('src', '../resources/icon-arrow-down.svg');
                imgElem.setAttribute('srcset', '../resources/icon-arrow-down.svg');
            }
        };
    } else {
        console.log('No Content Title found...');
    }

    // console.log(contentType);
    // let elem = document.getElementById("chamber-data");

    // Handle data for the table

    let congress = localStorage.getItem("congress");
    //console.log("CONGRESS:", congress);
    document.getElementById('selected-congress').innerHTML = 'Congress ' + congress;

    if (typeof data !== 'undefined') { // Only When data is available
        document.getElementById('waiting-flag').style.display = "none";
        InitTable(data);
    } else {
        //contentType = 'xxx';
        getData(congress, contentType).then(
            data => {
                document.getElementById('waiting-flag').style.display = "none";
                //console.log("Promise returns good!!!", data);
                if (data.status === "OK") {
                    InitTable(data);
                } else {
                    alert("Server Returns Error: " + data.errors);
                    document.location.href = errorPage;
                }
            },
            error => {
                document.getElementById('waiting-flag').style.display = "none";
                alert(error);
                document.location.href = errorPage;
            });
    }

});