function getVec3Color(r,g,b){
    if(Array.isArray(r) && g===undefined && b===undefined)
    {
        return new BABYLON.Color3(r[0],r[1],r[2]);
    }
    else
    {
        return new BABYLON.Color3(r,g,b);
    }
}

function getVec3Pos(r,g,b){
    if(Array.isArray(r) && g===undefined && b===undefined)
    {
        return new BABYLON.Vector3(r[0],r[1],r[2]);
    }
    else
    {
        return new BABYLON.Vector3(r,g,b);
    }
}

function toRad(angle)
{
    return angle*Math.PI/180;
}

var _componentCount = 0;
class Component{
    constructor()
    {
        this._num = _componentCount;
        _componentCount += 1;
        this.setTypeName("undefined");
    }
    __setAttributes(name, count){
        this._typeName = name;
        this._num = count;
    }
    __setNum(value){ this._num = value; }
    getName(){ return this.getTypeName()+this._num.toString(10); }
    getTypeName(){ return this._typeName; }
    setTypeName(name) { this._typeName = name; }
}

var _cameraCount = 0;
class Camera extends Component{
    constructor(scene, canvas)
    {
        super();
        super.__setAttributes("Camera",_cameraCount);
        this._scene = scene;
        this._canvas = canvas;
        this._camera = null;
        _cameraCount += 1;
    }

    setArcRotateCamera(alpha, beta, radius, x,y,z)
    {
        this._camera = new BABYLON.ArcRotateCamera(
            super.getName(),
            alpha, beta, radius, 
            getVec3Pos(x,y,z), 
            this._scene.__getScene()
        )

        this.attachToScene();
    }

    attachToScene(){
        this._camera.attachControl(this._canvas, false);
    }

    setAngularSensibility(value){ this._camera.angularSensibility = value; }
    setMoveSensibility(value) { this._camera.moveSensibility = value; }
    setWhellPrecision(value) { this._camera.wheelPrecision = value; }
    setPinchPrecision(value) { this._camera.pinchPrecision = value; }
    setLowerRadiusLimit(value) { this._camera.lowerRadiusLimit = value; }
    setUpperRadiusLimit(value) { this._camera.upperRadiusLimit = value; }
    setTarget(obj) { this._camera.target = obj; }
}

var _textureCount = 0;
class Texture extends Component{
    constructor(scene)
    {
        super();
        super.__setAttributes("Texture",_textureCount);
        this._scene = scene;
        this._path = null;
        this._texture = null;
    }

    setEquiRectangularTexture(path, size)
    {
        this._path = path;
        if(size===undefined)
        {
            this._texture = new BABYLON.EquiRectangularCubeTexture(this._path, this._scene.__getScene());
        }else{
            this._texture = new BABYLON.EquiRectangularCubeTexture(this._path, this._scene.__getScene(), size);
        }

    }

    __getTexture()
    {
        return this._texture;
    }
}

var _materialCount = 0;
class Material extends Component{
    constructor(scene)
    {
        super();
        super.__setAttributes("Material",_materialCount);
        this._scene = scene;
        this._material = null;
    }

    setPBRMaterial()
    {
        this._material = new BABYLON.PBRMaterial(super.getName(),this._scene.__getScene());
    }

    setAlpha(value)
    {
        this._material.alpha = value;
    }

    setReflectionTexture(texture)
    {
        this._material.reflectionTexture = texture.__getTexture();
    }

    __getMaterial()
    {
        return this._material;
    }
}

var _meshCount = 0;
class Mesh extends Component{
    constructor(scene)
    {
        super();
        super.__setAttributes("Mesh",_meshCount);
        this._scene = scene
        this._mesh = null
        _meshCount += 1;
    }

    __setMesh(mesh)
    {
        this._mesh = mesh;
    }

    init()
    {
        this._mesh = new BABYLON.Mesh(super.getName(), this._scene.__getScene());
    }

    setMaterial(material)
    {
        this._mesh.material = material.__getMaterial();
    }

    remove()
    {
        this._mesh.dispose();
        this._mesh = null;
    }

    __getMesh(){ return this._mesh; }
}

var _skeletionCount = 0;
class Skeleton extends Component{
    constructor(scene)
    {
        super();
        super.__setAttributes("Skeleton",_skeletionCount);
        this._scene = scene
        this._skeleton = null
        _skeletionCount += 1;    
    }

    __setSkeleton(skeleton)
    {
        this._skeleton = skeleton;
    }

    __getSkeleton()
    {
        return this._skeleton;
    }

    setBoneRotation(num, x,y,z){
        this._skeleton.bones[num].rotation = getVec3Pos(x,y,z);
    }
}

class ExternalImport extends Component{
    constructor(scene)
    {
        super();
        super.setTypeName("ExternalImport");
        this._scene = scene;
        this.setEmpty();
        this._path = null;
    }

    setEmpty()
    {
        this._meshes = [];
        this._skeletons = [];
        this._particleSystems = [];
    }

    setFromBabylonStrData(strData)
    {

        BABYLON.SceneLoader.ImportMesh("","",'data:' + strData, this._scene.__getScene(),
        (meshes, particleSystems, skeletons) => {
            
            meshes.forEach((element)=>{
                var mesh = new Mesh(this._scene);
                mesh.__setMesh(element);
                this._meshes.push(mesh);
            });

            skeletons.forEach((element)=>{
                var skeleton = new Skeleton(this._scene);
                skeleton.__setSkeleton(element);
                this._skeletons.push(skeleton);
            });
            //obj._meshes = meshes;
            //obj._skeletons = skeletons;
            // obj._particleSystems = particleSystems;


        })
    }

    importBabylonFile(path, onLoadedCall)
    {
        this._path = path;
        var request = new XMLHttpRequest();
        request.open("GET", path);

        var obj = this;
        request.onload = ()=>{
            this.setFromBabylonStrData(request.response);
            if(onLoadedCall !== undefined)
            {
                onLoadedCall();
            }
        }
        
        request.onerror = function(){
            console.log("ERROR ON LOAD FILE: "+path);
        }
        
        request.send();
    }

    getPath()
    {
        return this._path;
    }

    getMeshes(){ return this._meshes; }
    getSkeletons(){ return this._skeletons; }
    getParticleSystems(){ return this._particleSystems; }
}

var _lightCount = 0;
class Light extends Component{
    constructor(scene)
    {
        super();
        super.__setAttributes("Light",_lightCount);
        this._scene = scene;
        this._light = null
        _lightCount += 1;
    }

    setPointLight(x,y,z)
    {

        this._light = new BABYLON.PointLight(super.getName(), getVec3Pos(x,y,z), this._scene.__getScene());
    }

    setAmbientLight()
    {
        this._light = new BABYLON.HemisphericLight(super.getName(), getVec3Pos(0,10,0), this._scene.__getScene());
    }

    getName(){ return this._num.toString(10) }

    __getLight(){ return this._light; }

    remove(){ 
        this._light.dispose();
        this._light = null; 
    }
}

class Engine
{
    constructor(canvas)
    {
        this._canvas = canvas
        this._engine = null
    }

    init(){ this._engine = new BABYLON.Engine(this._canvas, true); }

    __getEngine(){ return this._engine; }
}

class Scene{
    constructor(engine)
    {
        this._engine = engine;
        this._scene = null
    }

    init()
    {
        this._scene = new BABYLON.Scene(this._engine.__getEngine());
    }

    setClearColor(r,g,b){ this._scene.clearColor = getVec3Color(r,g,b); }
    getClearColor() { 
        return [
            this._scene.clearColor.r,
            this._scene.clearColor.g,
            this._scene.clearColor.b
        ]; 
    }
    setFogColor(r,g,b){ this._scene.fogColor = getVec3Color(r,g,b); }
    setFogDensity(value){
        this._scene.fogDensity = value;
    }
    getFogColor() {   
        return [
            this._scene.fogColor.r,
            this._scene.fogColor.g,
            this._scene.fogColor.b
        ];  
    }
    
    setFogExponentialMode(){ this._scene.fogMode = BABYLON.Scene.FOGMODE_EXP; }

    render(){ this._scene.render(); }
    renderLoop(){
        var sceneL = this._scene;
        this._engine.__getEngine().runRenderLoop(()=>{ sceneL.render(); });
    }


    __getScene(){ return this._scene; }

    registerBeforeRender(call){
        this._scene.registerBeforeRender(call);
    }

    refreshSize()
    {
        this._engine.__getEngine().resize();
    }
}

