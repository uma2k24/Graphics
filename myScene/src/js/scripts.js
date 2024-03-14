// Utsav Anantbhat


// Import libraries
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

// Import textures
import starsTexture from '../img/stars.jpg';
import nucleusTexture from '../img/Plutonium_Nucleus.jpg';
import electronTexture from '../img/Electron.jpg';

// Initialize renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Initialize myScene
const myScene = new THREE.Scene();

// Initialize the camera
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);


// Orbit controls
const orbit = new OrbitControls(camera, renderer.domElement);

// Set camera position and update orbit
camera.position.set(-90, 140, 140);
orbit.update();

// Create ambient light
const ambientLight = new THREE.AmbientLight(0x333333);
myScene.add(ambientLight);

// Load the stars texture for the background as a cube
const cubeTextureLoader = new THREE.CubeTextureLoader();
myScene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
]);

// Load textures for the Plutonium model
const textureLoader = new THREE.TextureLoader();
const nucleusGeo = new THREE.SphereGeometry(16, 30, 30);
const nucleusMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(nucleusTexture)
});
const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
myScene.add(nucleus);

// Adds the orbits of the electrons
function addOrbit(radius) {
    const geometry = new THREE.RingGeometry(radius, radius + 0.25, 128, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
    const orbit = new THREE.Mesh(geometry, material);
    orbit.rotation.x = Math.PI / 2;
    return orbit;  // Return the created orbit
}

// Create the Plutonium model
function createPlutonium(size, texture, position) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshBasicMaterial({
        map: textureLoader.load(texture)
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);

    // Add orbit
    const orbit = addOrbit(position);
    obj.add(orbit);  // Add orbit as a child of the nucleus Object3D

    myScene.add(obj);
    mesh.position.x = position
    return {mesh, obj}
}


// Electrons and their positions
const electronsData = [

    // Ring 1
    {size: 3, texture: electronTexture, position: 28},
    {size: 3, texture: electronTexture, position: 28},

    // Ring 2
    {size: 3, texture: electronTexture, position: 28*2},
    {size: 3, texture: electronTexture, position: 28*2},
    {size: 3, texture: electronTexture, position: 28*2},
    {size: 3, texture: electronTexture, position: 28*2},
    {size: 3, texture: electronTexture, position: 28*2},
    {size: 3, texture: electronTexture, position: 28*2},
    {size: 3, texture: electronTexture, position: 28*2},
    {size: 3, texture: electronTexture, position: 28*2},

    // Ring 3
    {size: 3, texture: electronTexture, position: 28*3},
    {size: 3, texture: electronTexture, position: 28*3},
    {size: 3, texture: electronTexture, position: 28*3},
    {size: 3, texture: electronTexture, position: 28*3},
    {size: 3, texture: electronTexture, position: 28*3},
    {size: 3, texture: electronTexture, position: 28*3},
    {size: 3, texture: electronTexture, position: 28*3},
    {size: 3, texture: electronTexture, position: 28*3},
    {size: 3, texture: electronTexture, position: 28*3},
    {size: 3, texture: electronTexture, position: 28*3},
    {size: 3, texture: electronTexture, position: 28*3},
    {size: 3, texture: electronTexture, position: 28*3},
    {size: 3, texture: electronTexture, position: 28*3},
    {size: 3, texture: electronTexture, position: 28*3},
    {size: 3, texture: electronTexture, position: 28*3},
    {size: 3, texture: electronTexture, position: 28*3},
    {size: 3, texture: electronTexture, position: 28*3},
    {size: 3, texture: electronTexture, position: 28*3},

    // Ring 4
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},
    {size: 3, texture: electronTexture, position: 28*4},

    // Ring 5
    {size: 3, texture: electronTexture, position: 28*5},
    {size: 3, texture: electronTexture, position: 28*5},
    {size: 3, texture: electronTexture, position: 28*5},
    {size: 3, texture: electronTexture, position: 28*5},
    {size: 3, texture: electronTexture, position: 28*5},
    {size: 3, texture: electronTexture, position: 28*5},
    {size: 3, texture: electronTexture, position: 28*5},
    {size: 3, texture: electronTexture, position: 28*5},
    {size: 3, texture: electronTexture, position: 28*5},
    {size: 3, texture: electronTexture, position: 28*5},
    {size: 3, texture: electronTexture, position: 28*5},
    {size: 3, texture: electronTexture, position: 28*5},
    {size: 3, texture: electronTexture, position: 28*5},
    {size: 3, texture: electronTexture, position: 28*5},
    {size: 3, texture: electronTexture, position: 28*5},
    {size: 3, texture: electronTexture, position: 28*5},
    {size: 3, texture: electronTexture, position: 28*5},
    {size: 3, texture: electronTexture, position: 28*5},
    {size: 3, texture: electronTexture, position: 28*5},
    {size: 3, texture: electronTexture, position: 28*5},
    {size: 3, texture: electronTexture, position: 28*5},
    {size: 3, texture: electronTexture, position: 28*5},
    {size: 3, texture: electronTexture, position: 28*5},
    {size: 3, texture: electronTexture, position: 28*5},

    // Ring 6
    {size: 3, texture: electronTexture, position: 28*6},
    {size: 3, texture: electronTexture, position: 28*6},
    {size: 3, texture: electronTexture, position: 28*6},
    {size: 3, texture: electronTexture, position: 28*6},
    {size: 3, texture: electronTexture, position: 28*6},
    {size: 3, texture: electronTexture, position: 28*6},
    {size: 3, texture: electronTexture, position: 28*6},
    {size: 3, texture: electronTexture, position: 28*6},

    //Ring 7
    {size: 3, texture: electronTexture, position: 28*7},
    {size: 3, texture: electronTexture, position: 28*7}
]

// Empty array to push electrons into
var electrons = [];

for(const electronData of electronsData){
    const electron = createPlutonium(electronData.size, electronData.texture, electronData.position, electronData.offset);
    electrons.push(electron);
}

// Create a pointlight
const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
myScene.add(pointLight);

// Animation function
function animate() {
    //Self-rotation
    nucleus.rotateY(0.008);

    //Around-nucleus-rotation
    for(let i = 0; i < electrons.length; i++){
        electrons[i].mesh.rotateY(0.04)
        electrons[i].mesh.rotateZ(0.04)
        electrons[i].obj.rotateY(i/10000)
        electrons[i].obj.rotateZ(i/5000)
    }

    renderer.render(myScene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});