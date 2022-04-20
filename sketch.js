var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    var flower = placeObject('./', 'DAFT_PUNK_HELMETS.obj', 
    new BABYLON.Vector3(0, 2, 0), scene, 8, new BABYLON.Vector3(0, 2 * Math.PI, 0));


    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

    return scene;
};
        window.initFunction = async function() {
            
            
            var asyncEngineCreation = async function() {
                try {
                return createDefaultEngine();
                } catch(e) {
                console.log("the available createEngine function failed. Creating the default engine instead");
                return createDefaultEngine();
                }
            }

            window.engine = await asyncEngineCreation();
if (!engine) throw 'engine should not be null.';
startRenderLoop(engine, canvas);
window.scene = createScene();};
initFunction().then(() => {sceneToRender = scene                    
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});

//load and place object in scene
function placeObject(folder, file, position, scene, scale = 1, rotation = new BABYLON.Vector3(0, 0, 0), wrap_color = false){
    let load = BABYLON.SceneLoader.ImportMesh(
        null,
         folder,
        file,
        scene,
        function (meshes) {
           for (const mesh of meshes) {
            mesh.position = position;
            mesh.rotation = rotation;
            mesh.scaling = new BABYLON.Vector3(scale, scale, scale);
            if(wrap_color){
                var mat = new BABYLON.StandardMaterial("material", scene);
                mat.diffuseColor = wrap_color;
                mesh.material = mat;
            }
           }


    });

}