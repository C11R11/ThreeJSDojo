import * as THREE from '/build/three.module.js'
import { OrbitControls } from '/jsm/controls/OrbitControls'
import {GUI} from '/jsm/libs/dat.gui.module'

const gui = new GUI()
const scene: THREE.Scene = new THREE.Scene()

const camera1: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 60)
var frustumSize = 20;
  var aspect =
    document.getElementById("top-camera").clientWidth /
    document.getElementById("top-camera").clientHeight;
const camera2: THREE.OrthographicCamera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    0.1,
    30
  );
const camera3: THREE.OrthographicCamera = new THREE.OrthographicCamera(-50, 50, 50, -50, 0.1, 500)
const camera4: THREE.OrthographicCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)

camera1.position.z = 34
camera1.position.y = 7
camera2.position.y = 26
//camera2.position.z = 12
camera2.lookAt(new THREE.Vector3(0, 0, 0))
camera3.position.z = 45
camera3.position.y = 81
camera3.lookAt(new THREE.Vector3(0, 0, 0))
// camera4.position.x = 2
// camera4.lookAt(new THREE.Vector3(0, 0, 0))

var cameraHelper1 = new THREE.CameraHelper(camera1);
cameraHelper1.visible = false
scene.add(cameraHelper1)

var cameraHelper2 = new THREE.CameraHelper(camera2);
cameraHelper2.visible = false
scene.add(cameraHelper2)

// var light = new THREE.HemisphereLight(new THREE.Color("white"), new THREE.Color("gray"));
// scene.add(light);

// var helper = new THREE.HemisphereLightHelper(light, 5);
// scene.add(helper);

//ambient light
// const light = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(light);

// pointlight
const light = new THREE.PointLight(0xffffff, 2.0, 30);
light.position.set(0, 20,0)
scene.add(light);
const pointLightHelper = new THREE.PointLightHelper(light);
//scene.add(pointLightHelper);


const canvas1: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("c1")
const canvas2: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("c2")
const canvas3: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("top-camera")
// const canvas4: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("c4")
const renderer1: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas: canvas1 })
renderer1.setSize(document.getElementById("c1").clientWidth, document.getElementById("c1").clientHeight)
const renderer2: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas: canvas2 })
renderer2.setSize(document.getElementById("c2").clientWidth, document.getElementById("c2").clientHeight)
const renderer3: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas: canvas3})
renderer3.setSize(document.getElementById("top-camera").clientWidth, document.getElementById("top-camera").clientHeight)
// const renderer4: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas: canvas4 })
// renderer4.setSize(20-20, 500)

//document.body.appendChild(renderer.domElement)
var size = 100;
var divisions = 10;

var gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );


const controls = new OrbitControls(camera3, renderer3.domElement)
//const controls2 = new OrbitControls(camera2, renderer2.domElement)

const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(10,10,10)
const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe:true})
const materialFolder = gui.addFolder('THREE.Material')

var options = {
    side: {
        "FrontSide": THREE.FrontSide,
        "BackSide": THREE.BackSide,
        "DoubleSide": THREE.DoubleSide,
    },
    combine: {
        "MultiplyOperation": THREE.MultiplyOperation,
        "MixOperation": THREE.MixOperation,
        "AddOperation": THREE.AddOperation
    },
}

materialFolder.add(material, 'transparent')
materialFolder.add(material, 'opacity', 0, 1, 0.01)
materialFolder.add(material, 'depthTest')
materialFolder.add(material, 'depthWrite')
materialFolder.add(material, 'alphaTest', 0, 1, 0.01).onChange(() => updateMaterial())
materialFolder.add(material, 'visible')
materialFolder.add(material, 'side', options.side).onChange(() => updateMaterial())
materialFolder.open()
const cube: THREE.Mesh = new THREE.Mesh(geometry, material)
cube.position.y = 5
scene.add(cube)

function updateMaterial() {
    material.side = Number(material.side)
    material.combine = Number(material.combine)
    material.needsUpdate = true
}

const cubeFolder = gui.addFolder("Cube")
cubeFolder.add(cube.rotation, "x", 0, Math.PI * 2, 0.01).name("rotation-x")
cubeFolder.add(cube.rotation, "y", 0, Math.PI * 2, 0.01)
cubeFolder.add(cube.rotation, "z", 0, Math.PI * 2, 0.01)
cubeFolder.add(cube.position, "x", -20, 50, 1).name("position-x")
cubeFolder.add(cube.position, "y", -20, 50, 1)
cubeFolder.add(cube.position, "z", -20, 50, 1)
cubeFolder.open()
const cameraFolder = gui.addFolder("Camera")
cameraFolder.add(cameraHelper1, "visible", false).name("perspective")
cameraFolder.add(camera1.position, "x", -20, 50, 1)
cameraFolder.add(camera1.position, "y", -20, 50, 1)
cameraFolder.add(camera1.position, "z", -20, 50, 1)
cameraFolder.add(cameraHelper2, "visible", false).name("ortho")
cameraFolder.add(camera2.position, "x", -20, 50, 1)
cameraFolder.add(camera2.position, "y", -20, 50, 1)
cameraFolder.add(camera2.position, "z", -20, 50, 1)
cameraFolder.add(camera2, "zoom", -20, 50, 1)
cameraFolder.add(camera3.position, "x", 0, 100, 1).name("all-camera-pos-x")
cameraFolder.add(camera3.position, "y", 0, 100, 1)
cameraFolder.add(camera3.position, "z", 0, 100, 1)
cameraFolder.open()

const axesHelper = new THREE.AxesHelper(5);
axesHelper.name = "axesHelper_1"
axesHelper.position.set(0,0,0);
scene.add(axesHelper)

var animate = function () {
    requestAnimationFrame(animate)

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    controls.update()
   // controls2.update()

    renderer1.render(scene, camera1)
    renderer2.render(scene, camera2)
    renderer3.render(scene, camera3)
    // renderer4.render(scene, camera4)
};

animate();