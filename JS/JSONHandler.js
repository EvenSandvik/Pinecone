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

let kommunedata = new Data(104857);
kommunedata.load(kommunedata.fileid, function (input) {
kommunedata.data = input;
  if (kommunedata.onload) { kommunedata.onload() }
});


