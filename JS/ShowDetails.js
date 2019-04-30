/**
 * Show details about a kommune
 * @param kommunenr, the given number
 */
function detaljerKommune(kommunenr) {
    // Remove all info from previous search
    let info = document.getElementById("kommune_info");
    let detaljer = document.getElementById("kommune_detaljer");
    removeChildren(info);
    removeChildren(detaljer);

    // Check for legal arguments
    if (!detaljBef.getIDs().includes(kommunenr)) {
        console.log("Illegal argument. No such kommune.");
        let error = document.createTextNode("Invalid kommune-number.");
        info.appendChild(error);
        return;
    }

    // Get all info about the given kommunenr
    let befolkningsinfo = detaljBef.getInfo(kommunenr);
    let sysselinfo = syssel.getInfo(kommunenr);
    let utdanningsinfo = utdanning.getInfo(kommunenr);

    showKommuneInfo(kommunenr, befolkningsinfo, sysselinfo, utdanningsinfo, info, detaljer);
    showKommuneHistory(befolkningsinfo, sysselinfo, utdanningsinfo);

}

/**
 * Show all development in data for a specific kommune
 * @param {*} befolkningsinfo information about population
 * @param {*} sysselinfo information about work-statistics
 * @param {*} utdanningsinfo information about education
 * @param {*} info info-div in index.html
 * @param {*} detaljer detaljer-div in index.html
 */
function showKommuneHistory(befolkningsinfo, sysselinfo, utdanningsinfo){
    let kommunenavn = Object.keys(befolkningsinfo)[0];

    // Create tables to show the detailed info about the kommune
    createInfoTable(befolkningsinfo[kommunenavn], "Befolkning");
    createInfoTable(sysselinfo[kommunenavn], "Sysselsatte (%)");
    createInfoTable(utdanningsinfo[kommunenavn]["01"], "Grunnskoleutdannelse (%)");
    createInfoTable(utdanningsinfo[kommunenavn]["02a"], "Videregående skole (%)");
    createInfoTable(utdanningsinfo[kommunenavn]["11"], "Fagskole (%)");
    createInfoTable(utdanningsinfo[kommunenavn]["03a"], "Universitet/høyskole, kort (%)");
    createInfoTable(utdanningsinfo[kommunenavn]["04a"], "Universitet/høyskole, lang (%)");
    createInfoTable(utdanningsinfo[kommunenavn]["09a"], "Ingen/uoppgitt utdannelse (%)");
}

/**
 * Create and append tables to details in HTML-sheet
 * @param {*} info the object to get information from
 * @param {*} type the title of the table
 */
function createInfoTable(info, type){
    let htmlPlace = document.getElementById("kommune_detaljer");
    let div = document.createElement("DIV");
    let table = document.createElement("TABLE");

    // Create table header
    let header = document.createElement("TR");
    let headerTitle = document.createElement("TH");
    headerTitle.innerHTML = type;
    header.appendChild(headerTitle);
    table.appendChild(header);

    // Create top row of table
    let headerRow = document.createElement("TR");
    let c1 = document.createElement("TH");
    c1.innerHTML = "År";
    let c2 = document.createElement("TH");
    c2.innerHTML = "Kvinner"
    let c3 = document.createElement("TH");
    c3.innerHTML = "Menn";
    headerRow.appendChild(c1);
    headerRow.appendChild(c2);
    headerRow.appendChild(c3);
    table.appendChild(headerRow);
    div.appendChild(table);
    htmlPlace.appendChild(div);

    // Add all elements (assumes all data have the same years)
    for(const yy in info.Kvinner){
        let tr = document.createElement("TR");
        let c1 = document.createElement("TD");
        c1.innerHTML = yy;
        let c2 = document.createElement("TD");
        c2.innerHTML = info.Kvinner[yy];
        let c3 = document.createElement("TD");
        c3.innerHTML = info.Menn[yy];

        tr.appendChild(c1);
        tr.appendChild(c2);
        tr.appendChild(c3);
        table.appendChild(tr);
    }
}

/**
 * Shows all high-level information related to a kommune
 * @param {*} kommunenr nummeret på kommunen
 * @param {*} befolkningsinfo information about population
 * @param {*} sysselinfo information about work-statistics
 * @param {*} utdanningsinfo information about education
 * @param {*} info info-div in index.html
 * @param {*} detaljer detaljer-div in index.html
 */
function showKommuneInfo(kommunenr, befolkningsinfo, sysselinfo, utdanningsinfo, info, detaljer) {
    // Extract relevant information
    let kommunenavn = Object.keys(befolkningsinfo)[0];
    let sisteBefolkning = getTotalPopulation(befolkningsinfo[kommunenavn]);
    let sisteSysselsatte = getLastWorkStatistics(sysselinfo[kommunenavn]);
    let sisteUtdannelse = getLastEducationStatistics(utdanningsinfo[kommunenavn]);

    let totalBefolkning = sisteBefolkning["Kvinner"] + sisteBefolkning["Menn"];
    let sysselsatteAntall = Math.round(convertFromPercentage(sisteSysselsatte, totalBefolkning));
    let utdanningKvinnerAntall = Math.round(convertFromPercentage(sisteUtdannelse["Kvinner"], sisteBefolkning["Kvinner"]));
    let utdanningMennAntall = Math.round(convertFromPercentage(sisteUtdannelse["Menn"], sisteBefolkning["Menn"]));

    // The div to wrap it all
    let theDiv = document.createElement("DIV");
    let heading = document.createElement("H3");
    heading.innerHTML = "Detaljer fra siste måling"
    theDiv.appendChild(heading);

    // Add info to document
    let kommuneinfo = document.createTextNode("Kommunenavn: " + kommunenavn + ", kommunenr: " + kommunenr);
    info.appendChild(kommuneinfo);

    let befolkning = document.createTextNode("Total befolkning ved siste måling: " + totalBefolkning)
    theDiv.appendChild(befolkning);
    theDiv.appendChild(document.createElement("BR"));

    let sysselsatte = document.createTextNode("Sysselsatte: " + sysselsatteAntall + " (" + sisteSysselsatte + "%)");
    theDiv.appendChild(sysselsatte);
    theDiv.appendChild(document.createElement("BR"));

    let utdannelseMenn = document.createTextNode("Høyere utdannelse (menn): " + utdanningMennAntall + " (" + sisteUtdannelse["Menn"] + "%) ");
    let utdannelseKvinner = document.createTextNode("Høyere utdannelse (kvinner): " + utdanningKvinnerAntall + " (" + sisteUtdannelse["Kvinner"] + "%)");
    theDiv.appendChild(utdannelseMenn);
    theDiv.appendChild(document.createElement("BR"));
    theDiv.appendChild(utdannelseKvinner);
    detaljer.appendChild(theDiv)

}

/**
 * Converts from a percentage to an amount number
 * @param {*} percentage, the given percentage
 * @param {*} total, the total amount of people
 */
function convertFromPercentage(percentage, total) {
    return (percentage / 100 * total);
}

/**
 * Removes all children from the given node
 * @param {*} node
 */
function removeChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

/**
 * @param data, data on the form: {kommunenummer: v, Menn:{y:v}, Kvinner:{y:v}}
 * @return the total population from the last year of measure
 */
function getTotalPopulation(data) {
    let kvinner = Object.keys(data.Kvinner).reduce((a, b) => a > b ? a : b);
    let menn = Object.keys(data.Menn).reduce((a, b) => a > b ? a : b);

    return { Kvinner: data.Kvinner[kvinner], Menn: data.Menn[menn] };
}

/**
 *
 * @param {*} data data on the form: {kommunenummer: v, Menn:{y:v}, Kvinner:{y:v}, Begge:{y:v}}
 * @return the amount of employed people of the last measured year in %
 */
function getLastWorkStatistics(data) {
    let lastYear = Object.keys(data["Begge kjønn"]).reduce((a, b) => a > b ? a : b);
    return data["Begge kjønn"][lastYear];
}

/**
 *
 * @param {*} data data on the form: {kommunenummer: v, Menn:{y:v}, Kvinner:{y:v}, Begge:{y:v}}
 * @return the amount of employed people of the last measured year in %
 */
function getLastEducationStatistics(data) {
    // Assumes all data are measured in the same year
    let year = Object.keys(data["04a"].Kvinner).reduce((a, b) => a > b ? a : b);

    // Get all percentages

    // Long education
    let kvinnerLong = data["04a"]["Kvinner"][year];
    let mennLong = data["04a"]["Menn"][year];

    // Short education (3y, bachelor)
    let kvinnerShort = data["03a"]["Kvinner"][year];
    let mennShort = data["03a"]["Menn"][year];

    // Total
    let kvinner = kvinnerLong + kvinnerShort;
    let menn = mennShort + mennLong;

    return { Kvinner: kvinner, Menn: menn };
}
