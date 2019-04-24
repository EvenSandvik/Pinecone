/**
 * Get and show overview data, when JSON request has loaded.
 */
function overview() {
    let kommuneBefolkning = befolkning.data.elementer;
    let table = document.getElementById("oversikt_tabell");
    for (let kommune in kommuneBefolkning) {
        // Get all data from current kommune
        let data = kommuneBefolkning[kommune];

        // Create new tablerow
        let tableRow = document.createElement("TR");

        // Add kommunenavn
        let htmlname = document.createElement("TD");
        htmlname.innerHTML = kommune;
        tableRow.appendChild(htmlname);

        // Add kommunenr
        let nr = data.kommunenummer;
        let htmlnr = document.createElement("TD");
        htmlnr.innerHTML = nr;
        tableRow.appendChild(htmlnr);

        let tot = getTotalPopulation(data);
        tot = tot["Kvinner"] + tot["Menn"];
        let htmltot = document.createElement("TD");
        htmltot.innerHTML = tot;
        tableRow.appendChild(htmltot);

        table.appendChild(tableRow);
    }
}

function detaljerKommune(kommunenr) {
    // Remove all info from previous search
    let info = document.getElementById("kommune_info");
    let detaljer = document.getElementById("kommune_detaljer");
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
    let befolkningsinfo = detaljBef.getInfo(kommunenr);
    let sysselinfo = syssel.getInfo(kommunenr);
    let utdanningsinfo = utdanning.getInfo(kommunenr);

    // Extract relevant info
    let kommunenavn = Object.keys(befolkningsinfo)[0];
    let sisteBefolkning = getTotalPopulation(befolkningsinfo[kommunenavn]);
    let sisteSysselsatte = getLastWorkStatistics(sysselinfo[kommunenavn]);
    let sisteUtdannelse = getLastEducationStatistics(utdanningsinfo[kommunenavn]);
    
    let totalBefolkning = sisteBefolkning["Kvinner"] + sisteBefolkning["Menn"];
    let sysselsatteAntall = Math.round(convertFromPercentage(sisteSysselsatte, totalBefolkning));
    let utdanningKvinnerAntall = Math.round(convertFromPercentage(sisteUtdannelse["Kvinner"], sisteBefolkning["Kvinner"]));
    let utdanningMennAntall = Math.round(convertFromPercentage(sisteUtdannelse["Menn"], sisteBefolkning["Menn"]));

    // Add info to document
    let kommuneinfo = document.createTextNode("Kommunenavn: " + kommunenavn + ", kommunenr: " + kommunenr);
    info.appendChild(kommuneinfo);

    let befolkning = document.createTextNode("Total befolkning ved siste måling: " + totalBefolkning)
    detaljer.appendChild(befolkning);
    detaljer.appendChild(document.createElement("BR"));

    let sysselsatte = document.createTextNode("Sysselsatte: " + sysselsatteAntall + " (" + sisteSysselsatte + "%)");
    detaljer.appendChild(sysselsatte);
    detaljer.appendChild(document.createElement("BR"));

    let utdannelseMenn = document.createTextNode("Høyere utdannelse (menn): " + utdanningMennAntall + " (" + sisteUtdannelse["Menn"] + "%) ");
    let utdannelseKvinner = document.createTextNode("Høyere utdannelse (kvinner): " + utdanningKvinnerAntall + " (" + sisteUtdannelse["Kvinner"] + "%)");    
    detaljer.appendChild(utdannelseMenn);
    detaljer.appendChild(document.createElement("BR"));
    detaljer.appendChild(utdannelseKvinner);

}

function convertFromPercentage(percentage, total){
    return (percentage/100 * total);
}


function removeChildren(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

/**
 * @param data, data on the form: {kommunenummer: v, Menn:{y:v}, Kvinner:{y:v}}
 * @return the total population from the last year of measure
 */
function getTotalPopulation(data){
    let kvinner = Object.keys(data.Kvinner).reduce((a, b) => a > b ? a : b);
    let menn = Object.keys(data.Menn).reduce((a, b) => a > b ? a : b);

    return {Kvinner: data.Kvinner[kvinner], Menn: data.Menn[menn]};
}

/**
 * 
 * @param {*} data data on the form: {kommunenummer: v, Menn:{y:v}, Kvinner:{y:v}, Begge:{y:v}}
 * @return the amount of employed people of the last measured year in %
 */
function getLastWorkStatistics(data){
    let lastYear = Object.keys(data["Begge kjønn"]).reduce((a, b) => a > b ? a : b);
    return data["Begge kjønn"][lastYear];
}

/**
 * 
 * @param {*} data data on the form: {kommunenummer: v, Menn:{y:v}, Kvinner:{y:v}, Begge:{y:v}}
 * @return the amount of employed people of the last measured year in %
 */
function getLastEducationStatistics(data){
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

    return {Kvinner: kvinner, Menn: menn};
}