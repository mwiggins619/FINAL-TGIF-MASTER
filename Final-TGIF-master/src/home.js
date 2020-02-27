// ------- DOM utility functions ----

let keepOneOpen = (elem, ref) => {
    let elements = elem.querySelectorAll('[data-parent="#homeAccordion"]');
    let foundElem;
    let i = 0;

    for (let xElem of elements) {
        // console.log(i + ') ' + xElem.className);
        if (xElem.className.indexOf('show') !== -1) {
            foundElem = xElem;
            break;
        }
        if (xElem.className.indexOf('collapsing') !== -1) {
            foundElem = xElem;
            break;
        }
        i++;
    }
    if (foundElem == undefined) {
        //console.log('All sections all closed', elements);
        //elements[0].classList.add('show');
        ref.collapse('show');

    }
};

let congressInitFilter = (selected) => {


    let menuElem = document.getElementById("congress-select");
    // console.dir(menuElem);
    let optElem = Object;

    for (let idx = 102; idx <= 116; idx++) {
        optElem = document.createElement("option");
        optElem.innerHTML = idx;
        optElem.value = idx;
        if (idx == selected) {
            optElem.selected = true;
        }
        // optElem.href = "#";
        // optElem.id = "STATE-" + statesList[idx];
        // optElem.classList.add('dropdown-item');
        menuElem.append(optElem);
    }
};

// For Home Page -----------------------
$(document).ready(function() {

    let observableElem = document.getElementById('congress-select');
    observableElem.onchange = function(event) {
        //stateUpdateTable(event.currentTarget.value);
        //console.log("B EVENT", event.currentTarget.value);
        localStorage.setItem("congress", event.currentTarget.value);
    };

    //console.log('HOME PAGE');
    elem = document.getElementById('homeAccordion');
    if (elem != null) {

        $("#collapseOne").on("hidden.bs.collapse", () => keepOneOpen(elem, $("#collapseTwo")));
        $("#collapseTwo").on("hidden.bs.collapse", () => keepOneOpen(elem, $("#collapseOne")));
    } else {
        console.log('--> content1 id not found...');
    }
    let congress = localStorage.getItem("congress");
    if (congress == undefined) {
        localStorage.setItem("congress", "113");
        congressInitFilter(113);
    } else {
        congressInitFilter(congress);
    }
});