// ------------------------
// Main Variable definition

// ---------------------
// Utility Functions

function roundToTwo(num) { // Solution found on Stack Overflow
    return +(Math.round(num + "e+2") + "e-2");
}

// -------------------------------------
// Get Party Loyalty Average Percentage

let hasVoted = (item) => {

    return (typeof(item.total_votes) === "number" && item.total_votes > 0);
};

let getLoyaltyPct = (tab) => {

    if (tab.length === 0) {
        return 0;
    }
    let total = tab.reduce((acc, item) => {
        return acc + item.votes_with_party_pct;
    }, 0);
    return roundToTwo(total / tab.length);
};


let updatePctInfo = (fullData) => {
    let pctData = [];
    const gopTab = [];
    const demTab = [];
    const indTab = [];

    // console.log(data.leng);
    for (let item of fullData) {
        if (!hasVoted(item) && typeof(item.votes_with_party_pct) !== "number") {
            //console.log(item);
            continue;
        }
        if (item.party === 'R') {
            gopTab.push(item);
        } else if (item.party === 'D') {
            demTab.push(item);
        } else {
            indTab.push(item);
        }
        // fullTab.push(item);
    }
    //console.log(gopTab.length, gopTab);
    pctData[0] = {
        party: 'Republican',
        number: gopTab.length,
        avgPct: getLoyaltyPct(gopTab)
    };

    pctData[1] = {
        party: 'Democrat',
        number: demTab.length,
        avgPct: getLoyaltyPct(demTab)
    };

    pctData[2] = {
        party: 'Independent',
        number: indTab.length,
        avgPct: getLoyaltyPct(indTab)
    };

    return pctData;
};

//----------------------
// Sort Functions

let leastEngaged = (item1, item2) => {
    //console.log(item1.missed_votes_pct, item2.missed_votes_pct);
    if (item1.missed_votes_pct > item2.missed_votes_pct) {
        return -1;
    } else if (item1.missed_votes_pct < item2.missed_votes_pct) {
        return 1;
    } else {
        return 0;
    }
};

const mostEngaged = (item1, item2) => {
    if (item1.missed_votes_pct > item2.missed_votes_pct) {
        return 1;
    } else if (item1.missed_votes_pct < item2.missed_votes_pct) {
        return -1;
    } else {
        return 0;
    }
};

var leastLoyal = (item1, item2) => {
    if (item1.votes_with_party_pct > item2.votes_with_party_pct) {
        return 1;
    } else if (item1.votes_with_party_pct < item2.votes_with_party_pct) {
        return -1;
    } else {
        return 0;
    }
};

let mostLoyal = (item1, item2) => {
    if (item1.votes_with_party_pct > item2.votes_with_party_pct) {
        return -1;
    } else if (item1.votes_with_party_pct < item2.votes_with_party_pct) {
        return 1;
    } else {
        return 0;
    }
};

// ----------------------
// Stats Functions 


let getLeastLoyalTen = (tab) => {
    let newTab = [];
    let tenPct = Math.round(tab.length / 10);
    let refValue = tab[tenPct - 1].votes_with_party_pct;

    // console.log(tenPct, tab.length);
    // console.log('REF LEAST:', refValue, tab[tenPct].votes_with_party_pct);
    newTab = tab.filter((item) => {
        if (hasVoted(item)) {
            return item.votes_with_party_pct <= refValue;
        }
        return false;
    });
    return newTab;
};

let getMostLoyalTen = (tab) => {
    let newTab = [];
    let tenPct = Math.round(tab.length / 10);
    let refValue = tab[tenPct - 1].votes_with_party_pct;

    //    console.log(tenPct, tab.length);
    //    console.log('REF MOST:', refValue, tab[tenPct - 1].votes_with_party_pct);
    newTab = tab.filter((item) => {
        if (hasVoted(item)) {
            return item.votes_with_party_pct >= refValue;
        }
        return false;
    });

    return newTab;
};

let getLeastEngagedTen = (tab) => {
    let newTab = [];
    let tenPct = Math.round(tab.length / 10);
    let refValue = tab[tenPct - 1].missed_votes_pct;

    // console.log(tenPct, tab.length);
    // console.log('REF LEAST:', refValue, tab[tenPct].missed_votes_pct);
    newTab = tab.filter((item) => {
        if (hasVoted(item)) {
            return item.missed_votes_pct >= refValue;
        }
        return false;
    });
    return newTab;
};

let getMostEngagedTen = (tab) => {
    let newTab = [];
    let tenPct = Math.round(tab.length / 10);
    let refValue = tab[tenPct - 1].missed_votes_pct;

    //    console.log(tenPct, tab.length);
    //    console.log('REF MOST:', refValue, tab[tenPct - 1].missed_votes_pct);
    newTab = tab.filter((item) => {
        if (hasVoted(item)) {
            return item.missed_votes_pct <= refValue;
        }
        return false;
    });

    return newTab;
};

// -----------------------------------
// DOM Update Tables Functions

let addCell = (content, tRow) => {
        let tCell = document.createElement("td");

        tCell.innerHTML = content;
        tRow.append(tCell);
    };
    // GLANCE TABLE

let createGTableRow = (item) => {
    let tRow = document.createElement("tr");

    addCell(item.party, tRow);
    addCell(item.number, tRow);
    addCell(item.avgPct, tRow);

    return tRow;
}

let createChamberCell = (content) => {
    let cell = document.createElement("td");
    cell.innerHTML = content;
    return cell;
}

let createNameCell = (name, url) => {
    let cell = document.createElement("td");
    let link = document.createElement("a");

    link.innerHTML = name;
    link.setAttribute('title', name);
    link.setAttribute('href', url);
    link.setAttribute('target', '_blank');
    cell.append(link);
    return cell;

}

let createLTableRow = (item) => {
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
    newCell = createChamberCell(item.total_votes); // Party
    tRow.append(newCell);
    newCell = createChamberCell(item.votes_with_party_pct + '%'); // State
    tRow.append(newCell);

    return tRow;
}

let createETableRow = (item) => {
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
    newCell = createChamberCell(item.missed_votes); // Party
    tRow.append(newCell);
    newCell = createChamberCell(item.missed_votes_pct + '%'); // State
    tRow.append(newCell);

    return tRow;
}

// Update Page tables

let updatePage = (data) => {

    const pctInfo = updatePctInfo(data.results[0].members);
    const fullTab = data.results[0].members;

    // console.log(pctInfo);
    // console.log('UPDATE DOM');

    let elem = document.getElementById("chamber-glance");
    while (elem === null) {
        elem = document.getElementById("chamber-glance");
    }
    let tBody = elem.querySelector("tbody");
    for (item of pctInfo) {
        tBody.append(createGTableRow(item));
    };

    if (document.querySelector("body").baseURI.indexOf('loyalty') !== -1) {
        let loyaltyInfo = {
            most: getMostLoyalTen(fullTab.sort(mostLoyal)),
            least: getLeastLoyalTen(fullTab.sort(leastLoyal))
        };
        // console.log('LOYALTY INFO', loyaltyInfo);

        elem = document.getElementById("table-least");
        tBody = elem.querySelector("tbody");
        for (item of loyaltyInfo.least) {
            tBody.append(createLTableRow(item));
        };
        elem = document.getElementById("table-most");
        tBody = elem.querySelector("tbody");
        for (item of loyaltyInfo.most) {
            tBody.append(createLTableRow(item));
        };
    } else {
        let engagedInfo = {
            most: getMostEngagedTen(fullTab.sort(mostEngaged)),
            least: getLeastEngagedTen(fullTab.sort(leastEngaged))
        };
        //console.log('ENGAGED INFO', engagedInfo);

        elem = document.getElementById("table-least");
        tBody = elem.querySelector("tbody");
        for (item of engagedInfo.least) {
            tBody.append(createETableRow(item));
        };
        elem = document.getElementById("table-most");
        tBody = elem.querySelector("tbody");
        for (item of engagedInfo.most) {
            tBody.append(createETableRow(item));
        };
    }

}


// ---------------------
// Main Part
// ---------------------

$(document).ready(function() {

    if (typeof data !== 'undefined') { // Only When data is available
        updatePage(data);
    } else {
        let congress = localStorage.getItem("congress");
        //console.log("CONGRESS:", congress);
        document.getElementById('selected-congress').innerHTML = 'Congress ' + congress;

        getData(congress, contentType).then(
            data => {
                document.getElementById('waiting-flag').style.display = "none";
                //console.log("Promise returns good!!!", data);
                if (data.status === "OK") {
                    updatePage(data);
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