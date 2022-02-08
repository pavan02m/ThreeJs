let scene, camera, renderer;
let stack = [];
let world;
let overhangs = [];
let autopilot;
let gamEnded;
let lastTime;
let time;
const boxHeight = 1;
const originalBoxSize = 3;

const scoreElement = document.getElementById("score");
const instructionsElement = document.getElementById("instructions");
const resultsElement = document.getElementById("results");


init()

function init() {
    gamEnded = false

    scene = new THREE.Scene()

    addLayer(0, 0, originalBoxSize, originalBoxSize)

    addLayer(-10, 0, originalBoxSize, originalBoxSize, "x")

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6)
    dirLight.position.set(10, 20, 0);
    scene.add(dirLight);

    const aspect = window.innerWidth / window.innerHeight;
    const width = 20;
    const height = width / aspect;
    camera = new THREE.OrthographicCamera(
        width / -2,
        width / 2,
        height / 2,
        height / -2,
        1,
        100
    )
    camera.position.set(4, 4, 4)
    camera.lookAt(0, 0, 0)

    renderer = new THREE.WebGL1Renderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.render(scene, camera)
    document.body.appendChild(renderer.domElement)
}

function addLayer(x, z, width, depth, direction) {
    const y = boxHeight * stack.length;

    const layer = generateBox(x, y, z, width, depth);
    layer.direction = direction;
    stack.push(layer);
}

function generateBox(x, y, z, width, depth) {
    // ThreeJS
    const geometry = new THREE.BoxGeometry(width, boxHeight, depth);
    const color = new THREE.Color(`hsl(${60 + stack.length * 6}, 100%, 50%)`);
    const material = new THREE.MeshLambertMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    scene.add(mesh);

    return {
        threejs: mesh,
        width,
        depth
    };
}


let gameStarted = false;


window.addEventListener('click', () => {
    if(!gameStarted){
        renderer.setAnimationLoop(animation)
        gameStarted = true;
    }
    else{
        const topLayer = stack[stack.length - 1]
        const direction = topLayer.direction

        // next layer
        const nextX = direction == "x" ? 0 : -10
        const nextZ = direction == "z" ? 0 : -10
        const newDepth = originalBoxSize;
        const newWidth = originalBoxSize;
        const nextDirection = direction == "x" ? "z" : "x"
        addLayer(nextX, nextZ, newWidth, newDepth, nextDirection)
    }
        
});

function animation() {
    const speed = 0.1
    const topLayer = stack[stack.length - 1]
    topLayer.threejs.position[topLayer.direction] += speed
    if (camera.position.y < boxHeight * (stack.length - 2) + 4) {
        camera.position.y += speed
    }
    renderer.render(scene, camera)
}


