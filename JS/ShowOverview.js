/**
 * Get and show overview data, when JSON request has loaded.
 */
function overview() {

  var kommuneBefolkning = befolkning.data.elementer;
  var koms = befolkning.getNames();
  koms.sort();
  var alpha = ["A", "B", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "R", "S", "T", "U", "V", "Ø", "Å"];
  var oversikt = document.getElementById("oversikt");
  //Går gjennom alle bokstavane
  for (var boks in alpha) {

    //Create div
    var div = document.createElement("DIV");

    //Create header
    var heading = document.createElement("H3");
    heading.innerHTML = alpha[boks];
    heading.style.textAlign = "center";
    div.appendChild(heading);

    //Create table
    var table = document.createElement("TABLE");

    //Create tableheadlines
    var komKol = document.createElement("TH");
    komKol.innerHTML = "Kommune";
    var komNumKol = document.createElement("TH");
    komNumKol.innerHTML = "Kommunenummer";
    var manTalKol = document.createElement("TH");
    manTalKol.innerHTML = "Siste måling av total befolkning";

    //Append the tags
    table.appendChild(komKol);
    table.appendChild(komNumKol);
    table.appendChild(manTalKol);
    div.appendChild(table);

    //Går gjennom alle kommunenavna
    for (let kommune in koms) {

      //Break condition
      if (koms[kommune].charAt(0) != alpha[boks]) {
        continue;
      }

      //Get all data from current kommune
      var data = kommuneBefolkning[koms[kommune]];

      // Create new tablerow
      var tableRow = document.createElement("TR");

      // Add kommunenavn
      var htmlname = document.createElement("TD");
      htmlname.innerHTML = koms[kommune];
      tableRow.appendChild(htmlname);

      // Add kommunenr
      var nr = data.kommunenummer;
      var htmlnr = document.createElement("TD");
      htmlnr.innerHTML = nr;
      tableRow.appendChild(htmlnr);

      //Add befolkning
      var tot = getTotalPopulation(data);
      tot = tot["Kvinner"] + tot["Menn"];
      var htmltot = document.createElement("TD");
      htmltot.innerHTML = tot;
      tableRow.appendChild(htmltot);

      table.appendChild(tableRow);
      oversikt.appendChild(div);
    }
  }
}
