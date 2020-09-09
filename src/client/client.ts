import * as THREE from '/build/three.module.js'
import { OrbitControls } from '/jsm/controls/OrbitControls'
import {GUI} from '/jsm/libs/dat.gui.module'

const scene: THREE.Scene = new THREE.Scene()

const camera1: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 20)
const camera2: THREE.OrthographicCamera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 200)
const camera3: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 200)
const camera4: THREE.OrthographicCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)

var cameraHelper1 = new THREE.CameraHelper(camera1);
scene.add(cameraHelper1)

var cameraHelper2 = new THREE.CameraHelper(camera2);
scene.add(cameraHelper2)

const canvas1: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("c1")
const canvas2: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("c2")
const canvas3: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("top-camera")
// const canvas4: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("c4")
const renderer1: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas: canvas1 })
renderer1.setSize(document.getElementById("c1").clientWidth, document.getElementById("c1").clientHeight)
const renderer2: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas: canvas2 })
renderer2.setSize(document.getElementById("c2").clientWidth, document.getElementById("c2").clientHeight)
const renderer3: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas: canvas3 })
renderer3.setSize(document.getElementById("top-camera").clientWidth, document.getElementById("top-camera").clientHeight)
// const renderer4: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas: canvas4 })
// renderer4.setSize(200, 200)

//document.body.appendChild(renderer.domElement)
var size = 100;
var divisions = 10;

var gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );


const controls = new OrbitControls(camera3, renderer3.domElement)
//const controls2 = new OrbitControls(camera2, renderer2.domElement)

const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(10,10,10)
const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })

const cube: THREE.Mesh = new THREE.Mesh(geometry, material)
scene.add(cube)


camera1.position.z = 11
camera2.position.y = 12
camera2.lookAt(new THREE.Vector3(0, 0, 0))
camera3.position.z = 45
camera3.position.y = 81
camera3.lookAt(new THREE.Vector3(0, 0, 0))
// camera4.position.x = 2
// camera4.lookAt(new THREE.Vector3(0, 0, 0))

const gui = new GUI()
const cubeFolder = gui.addFolder("Cube")
cubeFolder.add(cube.rotation, "x", 0, Math.PI * 2, 0.01).name("rotation-x")
cubeFolder.add(cube.rotation, "y", 0, Math.PI * 2, 0.01)
cubeFolder.add(cube.rotation, "z", 0, Math.PI * 2, 0.01)
cubeFolder.add(cube.position, "x", 0, 20, 1).name("position-x")
cubeFolder.add(cube.position, "y", 0, 20, 1)
cubeFolder.add(cube.position, "z", 0, 20, 1)
cubeFolder.open()
const cameraFolder = gui.addFolder("Camera")
cameraFolder.add(cameraHelper1, "visible", true).name("perspective")
cameraFolder.add(camera1.position, "x", 0, 20, 1)
cameraFolder.add(camera1.position, "y", 0, 20, 1)
cameraFolder.add(camera1.position, "z", 0, 20, 1)
cameraFolder.add(cameraHelper2, "visible", true).name("ortho")
cameraFolder.add(camera2.position, "x", 0, 20, 1)
cameraFolder.add(camera2.position, "y", 0, 20, 1)
cameraFolder.add(camera2.position, "z", 0, 20, 1)
cameraFolder.add(camera3.position, "x", 0, 100, 1).name("all-camera-pos-x")
cameraFolder.add(camera3.position, "y", 0, 100, 1)
cameraFolder.add(camera3.position, "z", 0, 100, 1)
cameraFolder.open()

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