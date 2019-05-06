/**
 * Compares the two kommuner in the arguments. Gives info about historical data
 * with regards to employed people and which komme that has the highest growth (%)
 * @param {*} knr1 
 * @param {*} knr2 
 */
function sammenlign(knr1, knr2) {
    var placement = document.getElementById("sammen_info");
    removeChildren(placement);
    if (isError(knr1, knr2)) {
        return;
    }
    var k1 = syssel.getInfo(knr1);
    var navn1 = Object.keys(k1)[0];
    var k2 = syssel.getInfo(knr2);
    var navn2 = Object.keys(k2)[0];
    createComparisonTable(navn1, k1[navn1], navn2, k2[navn2]);
}


function createComparisonTable(navn1, k1, navn2, k2) {
    var placement = document.getElementById("sammen_info");
    var div = document.createElement("DIV");
    var table = document.createElement("TABLE");

    // Create table header
    var header = document.createElement("caption");
    header.innerHTML = "Sammenligning av kommuner: (Størst vekst i % fra forrige år markert i grønt)";
    table.appendChild(header);

    // Create top row of table
    var headerRow = document.createElement("TR");
    var h1 = document.createElement("TH");
    var h2 = document.createElement("TH");
    h2.colSpan = "2";
    h2.innerHTML = navn1;
    var h3 = document.createElement("TH");
    h3.colSpan = "2";
    h3.innerHTML = navn2;
    headerRow.appendChild(h1);
    headerRow.appendChild(h2);
    headerRow.appendChild(h3);
    table.appendChild(headerRow);
    div.appendChild(table);
    placement.appendChild(div);

    // Second row of table
    var lowerHeader = document.createElement("TR");
    var c1 = document.createElement("TH");
    c1.innerHTML = "År";
    var c2 = document.createElement("TH");
    c2.innerHTML = "Kvinner";
    var c3 = document.createElement("TH");
    c3.innerHTML = "Menn";
    var c4 = document.createElement("TH");
    c4.innerHTML = "Kvinner";
    var c5 = document.createElement("TH");
    c5.innerHTML = "Menn";

    lowerHeader.appendChild(c1);
    lowerHeader.appendChild(c2);
    lowerHeader.appendChild(c3);
    lowerHeader.appendChild(c4);
    lowerHeader.appendChild(c5);
    table.appendChild(lowerHeader);
    div.appendChild(table);
    placement.appendChild(div);

    var first = true;
    // Add all elements (assumes all data have the same years)
    for (const y in k1["Begge kjønn"]) {
        var tr = document.createElement("TR");
        // Year
        var c1 = document.createElement("TD");
        c1.innerHTML = y;

        // Kommune 1
        var c2 = document.createElement("TD");
        c2.innerHTML = k1["Kvinner"][y];
        var c3 = document.createElement("TD");
        c3.innerHTML = k1["Menn"][y];

        // Kommune 2
        var c4 = document.createElement("TD");
        c4.innerHTML = k2["Kvinner"][y];
        var c5 = document.createElement("TD");
        c5.innerHTML = k2["Menn"][y];

        if (!first) {
            // Find biggest growth for women
            var biggestGrowth = getBiggestGrowth(k1["Kvinner"][y - 1], k1["Kvinner"][y], k2["Kvinner"][y - 1], k2["Kvinner"][y]);
            if (biggestGrowth == "first") {
                c2.style.background = "green";
            } else if (biggestGrowth == "second") {
                c4.style.background = "green";
            }

            // Find biggest growth men
            var biggestGrowth = getBiggestGrowth(k1["Menn"][y - 1], k1["Menn"][y], k2["Menn"][y - 1], k2["Menn"][y]);
            if (biggestGrowth == "first") {
                c3.style.background = "green";
            } else if (biggestGrowth == "second") {
                c5.style.background = "green";
            }
        }

        tr.appendChild(c1);
        tr.appendChild(c2);
        tr.appendChild(c3);
        tr.appendChild(c4);
        tr.appendChild(c5);
        table.appendChild(tr);

        first = false;
    }
}

/**
 * Check wich of the parameters a and b which has the biggest growth
 * @param {*} a1 
 * @param {*} a2 
 * @param {*} b1 
 * @param {*} b2 
 * @returns "none" if they are decreasing or equal. "first" if a. "second" if b.
 */
function getBiggestGrowth(a1, a2, b1, b2) {
    var k1 = a2 - a1;
    var k2 = b2 - b1;
    // If they are both decreasing or they have equal growth, mark none.
    if ((k1 <= 0 && k2 <= 0) || k1 === k2)
        return "none";
    if (k1 > k2) {
        return "first";
    } if (k2 > k1) {
        return "second";
    }
    return "none";
}

/**
 * Check if there is an error in the arguments given, and give feedback to user.
 * @param {*} knr1 first kommune-nr
 * @param {*} knr2 second kommune-nr
 */
function isError(knr1, knr2) {
    var placement = document.getElementById("sammen_info");
    let message = "";
    let error = false;
    if (!syssel.getIDs().includes(knr1)) {
        console.log("No kommune with nr " + knr1);
        message += "No kommune with nr: " + knr1 + ". ";
        error = true;
    }
    if (!syssel.getIDs().includes(knr2)) {
        message += "No kommune with nr: " + knr2 + ".";
        error = true;
    }
    // If message is empty, no error occured
    if (error) {
        var errorNode = document.createTextNode(message);
        placement.appendChild(errorNode);
        return true;
    }
    return false;
}
