const states = {
    DEFAULT       : 1<<0,
    CHANGE_COLOR  : 1<<1,
    CHANGE_MODEL  : 1<<2,
    SPECIFICATIONS: 1<<3
}
state = states.DEFAULT;

console.log(`${states} ${state}`);

var canvas = document.getElementById("renderCanvas");
var engine = new Engine(canvas);
engine.init();

console.log("SCENE");
var scene = new Scene(engine);
scene.init();
scene.setClearColor(0.8,0.8,0.8);
scene.setFogColor(scene.getClearColor());
scene.setFogDensity(0.05);
scene.setFogExponentialMode();

console.log("LIGHT");
var light = new Light(scene);
light.setPointLight(10,0,-10);

console.log("LIGHT2");
var light2 = new Light(scene);
light2.setAmbientLight()

console.log("TEXTURE");
var eqTexture = new Texture(scene);
eqTexture.setEquiRectangularTexture("texturas/vista360.png", 64);

console.log("MESH");
var target = new Mesh(scene);
target.init();

console.log("CAMERA");
var camera = new Camera(scene, canvas);
console.log(camera.getName());
camera.setArcRotateCamera(-toRad(90), toRad(90), 4.5, 0,0,0);
camera.setAngularSensibility(2);
camera.setMoveSensibility(2);
camera.setWhellPrecision(30);
camera.setPinchPrecision(60);
camera.setLowerRadiusLimit(3);
camera.setUpperRadiusLimit(10);
camera.setTarget(target.__getMesh());

console.log("IMPORT");
var watch = new ExternalImport(scene);
watch.importBabylonFile("reloj.babylon",()=>{

    setMaterialColor("reloj.strap2",0.549,0.294,0.145);

    var clockFace = watch.getSkeletons()[0];
    //console.log(clockFace.__getSkeleton().bones[1]);
    var lente = watch.getMeshes()[1];
    const vidrio = new Material(scene);
    vidrio.setPBRMaterial();
    vidrio.setAlpha(0.1);
    vidrio.setReflectionTexture(eqTexture);
    lente.setMaterial(vidrio);

    var alpha = 0;
    scene.registerBeforeRender(()=>{
        alpha += 0.01;
        var d = new Date();

        var seconds = d.getSeconds()/60;
        var minutes = d.getMinutes()/60 + seconds/60;
        var hours = d.getHours()%12/12 + minutes/12;

        clockFace.setBoneRotation(1, 0,0,-hours*2*Math.PI);
        clockFace.setBoneRotation(2, 0,0,-minutes*2*Math.PI);
        clockFace.setBoneRotation(3, 0,0,-seconds*2*Math.PI);
    })
});

console.log("ALL LOADED");

/////////////////
scene.renderLoop();

console.log("LOOP");


window.addEventListener("resize", ()=>{
    scene.refreshSize();
},false);
// var request=new XMLHttpRequest();
// request.open("GET","reloj.babylon");
// request.onload=function(){
    
//     init(request.response);

// }
// request.onerror=function(){
//     alert("error to load things");
// }
// request.send();

function setMaterialColor(materialName, r, g, b)
{
    var materialSelected = scene.__getScene().getMaterialByName(materialName);
    if(materialSelected)
    {
        materialSelected.diffuseColor = getVec3Color(r, g, b);
    }
    
}