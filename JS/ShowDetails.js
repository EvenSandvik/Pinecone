/**
 * Show details about a kommune
 * @param kommunenr, the given number
 */
function detaljerKommune(kommunenr) {
    // Remove all info from previous search
    var info = document.getElementById("kommune_info");
    var detaljer = document.getElementById("kommune_detaljer");
    removeChildren(info);
    removeChildren(detaljer);

    // Check for legal arguments
    if (!detaljBef.getIDs().includes(kommunenr)) {
        console.log("Illegal argument. No such kommune.");
        var error = document.createTextNode("Invalid kommune-number.");
        info.appendChild(error);
        return;
    }

    // Get all info about the given kommunenr
    var befolkningsinfo = detaljBef.getInfo(kommunenr);
    var sysselinfo = syssel.getInfo(kommunenr);
    var utdanningsinfo = utdanning.getInfo(kommunenr);

    showKommuneInfo(kommunenr, befolkningsinfo, sysselinfo, utdanningsinfo, info, detaljer);
    showKommuneHistory(befolkningsinfo, sysselinfo, utdanningsinfo, info, detaljer);

}

/**
 * Show all development in data for a specific kommune
 * @param {*} befolkningsinfo information about population
 * @param {*} sysselinfo information about work-statistics
 * @param {*} utdanningsinfo information about education
 * @param {*} info info-div in index.html
 * @param {*} detaljer detaljer-div in index.html
 */
function showKommuneHistory(befolkningsinfo, sysselinfo, utdanningsinfo, info, detaljer){
    var befdiv = document.createElement("div");
    var sysdiv = document.createElement("div");
    var utddiv = document.createElement("div");

    var kommunenavn = Object.keys(befolkningsinfo)[0];

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
    var htmlPlace = document.getElementById("kommune_detaljer");
    var div = document.createElement("DIV");
    var table = document.createElement("TABLE");

    // Create table header
    var header = document.createElement("TR");
    var headerTitle = document.createElement("TH");
    headerTitle.innerHTML = type;
    header.appendChild(headerTitle);
    table.appendChild(header);

    // Create top row of table
    var headerRow = document.createElement("TR");
    var c1 = document.createElement("TH");
    c1.innerHTML = "År";
    var c2 = document.createElement("TH");
    c2.innerHTML = "Kvinner"
    var c3 = document.createElement("TH");
    c3.innerHTML = "Menn";
    headerRow.appendChild(c1);
    headerRow.appendChild(c2);
    headerRow.appendChild(c3);
    table.appendChild(headerRow);
    div.appendChild(table);
    htmlPlace.appendChild(div);

    // Add all elements (assumes all data have the same years)
    for(const yy in info.Kvinner){
        var tr = document.createElement("TR");
        var c1 = document.createElement("TD");
        c1.innerHTML = yy;
        var c2 = document.createElement("TD");
        c2.innerHTML = info.Kvinner[yy];
        var c3 = document.createElement("TD");
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
    var kommunenavn = Object.keys(befolkningsinfo)[0];
    var sisteBefolkning = getTotalPopulation(befolkningsinfo[kommunenavn]);
    var sisteSysselsatte = getLastWorkStatistics(sysselinfo[kommunenavn]);
    var sisteUtdannelse = getLastEducationStatistics(utdanningsinfo[kommunenavn]);

    var totalBefolkning = sisteBefolkning["Kvinner"] + sisteBefolkning["Menn"];
    var sysselsatteAntall = Math.round(convertFromPercentage(sisteSysselsatte, totalBefolkning));
    var utdanningKvinnerAntall = Math.round(convertFromPercentage(sisteUtdannelse["Kvinner"], sisteBefolkning["Kvinner"]));
    var utdanningMennAntall = Math.round(convertFromPercentage(sisteUtdannelse["Menn"], sisteBefolkning["Menn"]));

    // The div to wrap it all
    var theDiv = document.createElement("DIV");
    var heading = document.createElement("H3");
    heading.innerHTML = "Detaljer fra siste måling"
    theDiv.appendChild(heading);

    // Add info to document
    var kommuneinfo = document.createTextNode("Kommunenavn: " + kommunenavn + ", kommunenr: " + kommunenr);
    info.appendChild(kommuneinfo);

    var befolkning = document.createTextNode("Total befolkning ved siste måling: " + totalBefolkning)
    theDiv.appendChild(befolkning);
    theDiv.appendChild(document.createElement("BR"));

    var sysselsatte = document.createTextNode("Sysselsatte: " + sysselsatteAntall + " (" + sisteSysselsatte + "%)");
    theDiv.appendChild(sysselsatte);
    theDiv.appendChild(document.createElement("BR"));

    var utdannelseMenn = document.createTextNode("Høyere utdannelse (menn): " + utdanningMennAntall + " (" + sisteUtdannelse["Menn"] + "%) ");
    var utdannelseKvinner = document.createTextNode("Høyere utdannelse (kvinner): " + utdanningKvinnerAntall + " (" + sisteUtdannelse["Kvinner"] + "%)");
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
    var kvinner = Object.keys(data.Kvinner).reduce((a, b) => a > b ? a : b);
    var menn = Object.keys(data.Menn).reduce((a, b) => a > b ? a : b);

    return { Kvinner: data.Kvinner[kvinner], Menn: data.Menn[menn] };
}

/**
 *
 * @param {*} data data on the form: {kommunenummer: v, Menn:{y:v}, Kvinner:{y:v}, Begge:{y:v}}
 * @return the amount of employed people of the last measured year in %
 */
function getLastWorkStatistics(data) {
    var lastYear = Object.keys(data["Begge kjønn"]).reduce((a, b) => a > b ? a : b);
    return data["Begge kjønn"][lastYear];
}

/**
 *
 * @param {*} data data on the form: {kommunenummer: v, Menn:{y:v}, Kvinner:{y:v}, Begge:{y:v}}
 * @return the amount of employed people of the last measured year in %
 */
function getLastEducationStatistics(data) {
    // Assumes all data are measured in the same year
    var year = Object.keys(data["04a"].Kvinner).reduce((a, b) => a > b ? a : b);

    // Get all percentages

    // Long education
    var kvinnerLong = data["04a"]["Kvinner"][year];
    var mennLong = data["04a"]["Menn"][year];

    // Short education (3y, bachelor)
    var kvinnerShort = data["03a"]["Kvinner"][year];
    var mennShort = data["03a"]["Menn"][year];

    // Total
    var kvinner = kvinnerLong + kvinnerShort;
    var menn = mennShort + mennLong;

    return { Kvinner: kvinner, Menn: menn };
}
