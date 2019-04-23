function overview(){
    let kommuneBefolkning = befolkning.data.elementer;
    let table = document.getElementById("oversikt_tabell");
    for(let kommune in kommuneBefolkning){
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

        // Add befolkningsdata
        let kvinner = Object.keys(data.Kvinner).reduce((a, b) => a > b ? a : b);
        let menn = Object.keys(data.Menn).reduce((a, b) => a > b ? a : b);
        
        let tot = data.Kvinner[kvinner] + data.Menn[menn];
        let htmltot = document.createElement("TD");
        htmltot.innerHTML = tot;
        tableRow.appendChild(htmltot);

        table.appendChild(tableRow);
    }
}