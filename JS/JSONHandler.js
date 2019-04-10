function Data(fileid){
    this.fileid = fileid;
    this.data = {};
    this.onload = null;

    this.getNames = function(){

    };
    this.getIDs = function(){

    };
    this.getInfo = function(){

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
