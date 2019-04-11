function Data(fileid){
    this.fileid = fileid;
    this.data = {};
    this.onload = null;

    this.getNames = function(){
      return Object.keys(this.data.elementer);
    };
    this.getIDs = function(){
      var ret = [];
      for(var i in this.data.elementer){
        ret.push(this.data.elementer[i].kommunenummer);
      }
      return ret;
    };
    this.getInfo = function(){
      for(var i in this.data.elementer){
        if(this.data.elementer[i].kommunenummer === knum){
          return this.data.elementer[i];
        }
      }
      return null;
    };
    this.load = function(fileid, callback){
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://wildboy.uib.no/~tpe056/folk/"+ fileid + ".json");
            xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                let response = JSON.parse(xhr.responseText);
                callback(response);
                // If user set onload, call it.
                if(onload){
                    onload();
                }
            }
        };
        xhr.send();
    };
}

let apple = new Data(104857);
apple.onload = function(){console.log("HEYYYO");};
apple.load(apple.fileid, function(input){apple.data = input;});
