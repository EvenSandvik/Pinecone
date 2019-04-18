function Data(fileid) {
  this.fileid = fileid;
  this.data = {};
  this.onload = null;

  this.getNames = function () {
    return Object.keys(this.data.elementer);
  };

  this.getIDs = function () {
    var ret = [];
    for (var i in this.data.elementer) {
      ret.push(this.data.elementer[i].kommunenummer);
    }
    return ret;
  };

  this.getInfo = function (knum) {
    for (let kommunenavn in this.data.elementer) {
      if(this.data.elementer[kommunenavn].kommunenummer == knum){
        var kommune = {};
        kommune[kommunenavn] = this.data.elementer[kommunenavn];
        return kommune;
      }
    }
  };

  this.load = function (fileid, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://wildboy.uib.no/~tpe056/folk/" + fileid + ".json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        let response = JSON.parse(xhr.responseText);
        callback(response);

      }
    };
    xhr.send();
  };
}

// Load all the datasets for use.

let syssel = new Data(100145);
syssel.load(syssel.fileid, function(input){
  syssel.data = input;
  if(syssel.onload){syssel.onload();}
});

let utdanning = new Data(85432);
utdanning.load(utdanning.fileid, function(input){
  utdanning.data = input;
  if(utdanning.onload){
    utdanning.onload();
  }
})

let befolkning = new Data(104857);
befolkning.load(befolkning.fileid, function (input) {
befolkning.data = input;
  if (befolkning.onload) { befolkning.onload(); }
});


