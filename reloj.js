

var modelData=new XMLHttpRequest();
modelData.open("GET","reloj.babylon");
modelData.onload=function(){
    modelData = modelData.response;
    init();
}
modelData.onerror=function(){
    alert("error to load things");
}
modelData.send();