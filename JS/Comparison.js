function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length){
        console.log("There are differences in length");
        return false;
    } 
    a.sort(function(n1, n2){return n1-n2});
    b.sort(function(n1, n2){return n1-n2});

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function sammenlignArrays(){
    arr1 = syssel.getIDs();
    console.log("Syssel length: " + arr1.length);
    arr2 = detaljBef.getIDs();
    console.log("Befolkning length: " + arr2.length);
    arr3 = utdanning.getIDs();
    console.log("Utdanning length: " + arr3.length);

    if (arraysEqual(arr1, arr2)) {
        console.log("The id's are all the same for syssel and befolkning");
        return;
    }
    console.log("There are some differences in IDs");
}