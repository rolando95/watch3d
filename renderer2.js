function init(modelData){
    var canvas = document.getElementById("renderCanvas"); // Get the canvas element
    var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

    /******* Add the create scene function ******/
    
    var createScene = function () {
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.795);

        var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(10, 0, -10), scene);
        
        var light2 = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 10, 0), scene);
        light2.intensity = 2.4;

        const eqTexture = new BABYLON.EquiRectangularCubeTexture('texturas/vista360.png', scene, 64);
        // scene.createDefaultSkybox(eqTexture,false,1000);
        scene.fogColor = scene.clearColor;
        scene.fogDensity = 0.025;
        scene.fogMode = BABYLON.Scene.FOGMODE_EXP;

        var target = new BABYLON.Mesh("target",scene);

        var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI/2, 4.5, BABYLON.Vector3.Zero(), scene);
        camera.angularSensibility = 2;
        camera.moveSensibility = 2;
        camera.wheelPrecision = 30;
        camera.pinchPrecision = 60.0;
        camera.lowerRadiusLimit = 3;
        camera.upperRadiusLimit = 10; 
        camera.target = target;
        camera.attachControl(canvas, false);

        var strData = modelData;
        BABYLON.SceneLoader.ImportMesh("", "", 'data:' + strData, scene,  (meshes, particleSystems, skeletons) => {
    
            var skeleton = skeletons[0];
            var mesh = meshes[0];

            var lente = scene.getMeshByName("Lente");
            const vidrio = new BABYLON.PBRMaterial("metalR",scene);
            vidrio.alpha = 0.1;
            vidrio.reflectionTexture = eqTexture;
            lente.material = vidrio;

            //relojMesh.setEnabled(false);

            //console.log(mesh);
            // var correaMaterial = scene.getMaterialByName("reloj.Correa");
            // correaMaterial.diffuseColor = new BABYLON.Vector3(0,0,1);
            // console.log( correaMaterial);
            //camera.target = mesh;

            //mesh.rotation.x = Math.PI * .25;
            
            var alpha = 0;
            scene.registerBeforeRender(function () {
                alpha += 0.01;

                var d = new Date();

                var seconds = d.getSeconds()/60;
                var minutes = d.getMinutes()/60 + seconds/60;
                var hours = d.getHours()%12/12 + minutes/12;
                // skeleton.bones[1].rotate(BABYLON.Axis.Z, .01,BABYLON.Space.WORLD);
                // skeleton.bones[2].rotate(BABYLON.Axis.Z, .01);
                // skeleton.bones[3].rotate(BABYLON.Axis.Z, .01);
                
                //light.position.x = 10*Math.sin(alpha);
                //light.position.z = 10*Math.cos(alpha);

                skeleton.bones[1].rotation = new BABYLON.Vector3(0,0,-hours*2*Math.PI);
                skeleton.bones[2].rotation = new BABYLON.Vector3(0,0,-minutes*2*Math.PI);
                skeleton.bones[3].rotation = new BABYLON.Vector3(0,0,-seconds*2*Math.PI);

                //target.position.z = target.position.z + 0.001;
                
            });
            
        });


        return scene;
    }
    /******* End of the create scene function ******/

    var scene = createScene(); //Call the createScene function

    // Register a render loop to repeatedly render the scene
    engine.runRenderLoop(function () {
            scene.render();
    });

    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
            engine.resize();
    });

    var supportsOrientationChange = "onorientationchange" in window,
    orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

    window.addEventListener(orientationEvent, function() {
       // alert('HOLY ROTATING SCREENS BATMAN:' + window.orientation + " " + screen.width);

    }, false);
}