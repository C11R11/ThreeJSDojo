import * as THREE from "/build/three.module.js";
import { OrbitControls } from "/jsm/controls/OrbitControls";
import { GUI } from "/jsm/libs/dat.gui.module";
import { SceneUtils } from "/jsm/utils/SceneUtils";
import { DecalGeometry } from "/jsm/geometries/DecalGeometry";
import { Vector3 } from "/build/three.module.js";

const gui = new GUI();
const scene: THREE.Scene = new THREE.Scene();

const camaraArribaIzq: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
  50,
  1,
  0.1,
  600
);
var frustumSize = 20;
var aspect =
  document.getElementById("top-camera").clientWidth /
  document.getElementById("top-camera").clientHeight;

//const camaraAbajo: THREE.OrthographicCamera = new THREE.OrthographicCamera(-50, 50, 50, -50, 0.1, 500)
const camera4: THREE.OrthographicCamera = new THREE.OrthographicCamera(
  -1,
  1,
  1,
  -1,
  0.1,
  10
);

camaraArribaIzq.lookAt(new THREE.Vector3(1,0,0));

camaraArribaIzq.position.z = 0;
camaraArribaIzq.position.y = 0;
camaraArribaIzq.position.x = -40;

//ambient light
const light2 = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light2);

// pointlight
const light = new THREE.PointLight(0xffffff, 2.0, 30);
light.position.set(0, 20, 0);
scene.add(light);
const pointLightHelper = new THREE.PointLightHelper(light);
//scene.add(pointLightHelper);

const canvas1: HTMLCanvasElement = <HTMLCanvasElement>(
  document.getElementById("c1")
);
const canvas2: HTMLCanvasElement = <HTMLCanvasElement>(
  document.getElementById("c2")
);
const canvas3: HTMLCanvasElement = <HTMLCanvasElement>(
  document.getElementById("top-camera")
);
// const canvas4: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("c4")
const rendererArribaIzq: THREE.WebGLRenderer = new THREE.WebGLRenderer({
  canvas: canvas1,
});
rendererArribaIzq.setSize(
  document.getElementById("c1").clientWidth,
  document.getElementById("c1").clientHeight
);
const rendererAbajo: THREE.WebGLRenderer = new THREE.WebGLRenderer({
  canvas: canvas3,
});
rendererAbajo.setSize(
  document.getElementById("top-camera").clientWidth,
  document.getElementById("top-camera").clientHeight
);
// const renderer4: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas: canvas4 })
// renderer4.setSize(20-20, 500)

//document.body.appendChild(renderer.domElement)
var size = 100;
var divisions = 10;

var gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

let uniforms = {
  colorB: { type: "vec3", value: new THREE.Color(0x0000ff) },
  colorA: { type: "vec3", value: new THREE.Color(0x00ff00) },
};

// let materialShared = new THREE.ShaderMaterial({
//   uniforms: uniforms,
//   fragmentShader: fragmentShader(),
//   vertexShader: vertexShader(),
// });

const materialFolder = gui.addFolder("THREE.Material");

var options = {
  side: {
    FrontSide: THREE.FrontSide,
    BackSide: THREE.BackSide,
    DoubleSide: THREE.DoubleSide,
  },
  combine: {
    MultiplyOperation: THREE.MultiplyOperation,
    MixOperation: THREE.MixOperation,
    AddOperation: THREE.AddOperation,
  },
};

const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  transparent: true,
  opacity: 0.3,
});

materialFolder.add(material, "transparent");
materialFolder.add(material, "opacity", 0, 1, 0.01);
materialFolder.add(material, "depthTest");
materialFolder.add(material, "depthWrite");
materialFolder
  .add(material, "alphaTest", 0, 1, 0.01)
  .onChange(() => updateMaterial());
materialFolder.add(material, "visible");
materialFolder
  .add(material, "side", options.side)
  .onChange(() => updateMaterial());
materialFolder.open();

var localPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1);
var localPlane2 = new THREE.Plane(new THREE.Vector3(1, 0, 0), 1);

var globalPlane = new THREE.Plane(new THREE.Vector3(1, 1, 2), 0);

let globalPlanes: THREE.Plane[] = [];
globalPlanes.push(globalPlane);

let localPlanes: THREE.Plane[] = [];
localPlanes.push(localPlane);
localPlanes.push(localPlane2);

const sceneSection: THREE.Scene = new THREE.Scene();
const rendererArribaDer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
  canvas: canvas2,
});
rendererArribaDer.setSize(
  document.getElementById("c2").clientWidth,
  document.getElementById("c2").clientHeight
);

rendererArribaDer.clippingPlanes = globalPlanes;
//rendererAbajo.localClippingEnabled = true;
rendererArribaDer.localClippingEnabled = false;

let planeHelper = new THREE.PlaneHelper(globalPlane, 50, 0xffffff);
sceneSection.add(planeHelper);

var planeX = gui.addFolder("planeX");
planeX
  .add(globalPlane, "constant")
  .min(-50)
  .max(50)
  .onChange((d) => (globalPlane.constant = d));
planeX.open();

var material3 = new THREE.MeshStandardMaterial({
  color: new THREE.Color("white"),
  clippingPlanes: localPlanes,
});

const camaraArribaDer: THREE.OrthographicCamera = new THREE.OrthographicCamera(
  (frustumSize * aspect) / -2,
  (frustumSize * aspect) / 2,
  frustumSize / 2,
  frustumSize / -2,
  0.1,
  100
);

camaraArribaDer.position.y = 10;
//camaraArribaDer.position.copy(new THREE.Vector3( 3, 0, 0 ))
camaraArribaDer.lookAt(new THREE.Vector3(3, 0, 0));
var cameraHelper2 = new THREE.CameraHelper(camaraArribaDer);
cameraHelper2.visible = false;
sceneSection.add(cameraHelper2);

const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(10, 10, 10);
geometry.faces.forEach((face) => {
  face.color.setRGB(Math.random(), Math.random(), Math.random());
  console.log(face.normal);
});
const mat = new THREE.MeshLambertMaterial({
  vertexColors: true,
});

var facePlane = new THREE.Plane(geometry.faces[0].vertexNormals[0], 0);
let faceplaneHelperPolygon = new THREE.PlaneHelper(facePlane, 50, 0xffffff);
sceneSection.add(faceplaneHelperPolygon);

const controlArribaDer = new OrbitControls(
  camaraArribaDer,
  rendererArribaDer.domElement
);

const controlArribaIzq = new OrbitControls(
  camaraArribaIzq,
  rendererArribaIzq.domElement
);

const cubeSection: THREE.Mesh = new THREE.Mesh(geometry, mat);

sceneSection.add(cubeSection);

sceneSection.add(new THREE.AmbientLight(0xffffff, 0.9));

// // pointlight
const light3 = new THREE.PointLight(0xffffff, 2.0, 30);
light3.position.set(0, 20, 0);
sceneSection.add(light3);
// const pointLightHelper = new THREE.PointLightHelper(light);

var gridHelperSection = new THREE.GridHelper(100, 30);
sceneSection.add(gridHelperSection);

const cube: THREE.Mesh = new THREE.Mesh(geometry, material3);
//cube.position.y = 5
scene.add(cube);

var points: THREE.Vector3[] = [];
points.push(new THREE.Vector3(-10, 0, 1));
points.push(new THREE.Vector3(-5, 3, -1));
points.push(new THREE.Vector3(-1, 1, 1));
points.push(new THREE.Vector3(-10, 0, 1));

var geometryLine = new THREE.BufferGeometry().setFromPoints(points);
var materialLine = new THREE.LineBasicMaterial({
  color: 0x0000ff,
});
var line = new THREE.Line(geometryLine, materialLine);
scene.add(line);

let a = new THREE.Vector3();
let b = new THREE.Vector3();
let planeNormal = new THREE.Vector3();

a.subVectors(points[0], points[1]);
b.subVectors(points[0], points[2]);

planeNormal = planeNormal.crossVectors(a, b);
planeNormal.normalize;
console.log("planeNormal->", planeNormal);

let origin = new Vector3(0, 0, 0);

let distance = points[0].distanceTo(origin);
console.log("distance", distance);

// let planePolygon = new THREE.Plane( planeNormal, distance );
// console.log(planePolygon)

let planePolygon = new THREE.Plane();
planePolygon.setFromCoplanarPoints(points[0], points[1], points[2]);
console.log(planePolygon);

//rendererAbajo.clippingPlanes = [planePolygon]

var planeXHelp = gui.addFolder("plane");
planeXHelp
  .add(planePolygon, "constant")
  .min(-50)
  .max(50)
  .onChange((d) => (planePolygon.constant = d));
planeXHelp.open();

var coplanarPoint = new Vector3();
planePolygon.coplanarPoint(coplanarPoint);
console.log("coplanarPoint->", coplanarPoint);

// Create a basic rectangle geometry
var planeGeometry = new THREE.PlaneGeometry(100, 100);

// Align the geometry to the plane
var focalPoint = new THREE.Vector3()
  .copy(coplanarPoint)
  .add(planePolygon.normal);
planeGeometry.lookAt(focalPoint);
planeGeometry.translate(coplanarPoint.x, coplanarPoint.y, coplanarPoint.z);

// Create mesh with the geometry
var planeMaterial = new THREE.MeshLambertMaterial({
  color: 0xffff00,
  side: THREE.DoubleSide,
});
var dispPlane = new THREE.Mesh(planeGeometry, planeMaterial);
//scene.add(dispPlane);

console.log("dispPlane->", dispPlane);

const camaraAbajo: THREE.OrthographicCamera = new THREE.OrthographicCamera(
  -15,
  15,
  5,
  -5,
  0.1,
  2
);
var cameraHelper1 = new THREE.CameraHelper(camaraAbajo);
cameraHelper1.visible = true;
scene.add(cameraHelper1);

camaraAbajo.translateX(coplanarPoint.x);
camaraAbajo.translateY(coplanarPoint.y);
camaraAbajo.translateZ(coplanarPoint.z);
var dir = new THREE.Vector3();
dir.copy(planePolygon.normal);
//camaraAbajo.position.addScaledVector(dir, -1);
camaraAbajo.lookAt(dir);

var vec1 = new THREE.Vector3(0, 0, 1); // create once and reuse
var vec2 = new THREE.Vector3(0, 0, 1);

var angle = vec1.angleTo(vec2); // radians

let planeHelperPolygon = new THREE.PlaneHelper(planePolygon, 50, 0xffffff);
scene.add(planeHelperPolygon);

var box = new THREE.BoxHelper(planeHelperPolygon, 0xff00ff);
scene.add(box);

var geometryLine = new THREE.BufferGeometry().setFromPoints(points);
var materialLine = new THREE.LineBasicMaterial({
  color: 0x0000ff,
});
var line = new THREE.Line(geometryLine, materialLine);
scene.add(line);

function updateMaterial() {
  material.side = Number(material.side);
  material.combine = Number(material.combine);
  material.needsUpdate = true;
}

var geometryPlane = new THREE.PlaneGeometry(5, 20, 32);
var materialPlane = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  side: THREE.DoubleSide,
});
var plane = new THREE.Mesh(geometryPlane, materialPlane);
plane.position.set(10, 0, 0);
plane.rotateY(Math.PI / 2);
scene.add(plane);

var direction = new THREE.Vector3();
var far = new THREE.Vector3();
var intersects;

var objects = [];
objects.push(cube);

const raycaster = new THREE.Raycaster();
raycaster.set(
  line.position,
  direction.subVectors(plane.position, line.position).normalize()
);
//raycaster.far = far.subVectors(plane.position, line.position).length(); // comment this line to have an infinite ray
intersects = raycaster.intersectObject(cube);
console.log(intersects);
for (let i = 0; i < intersects.length; i++) {
  intersects[i].object.material.color.set(Math.random() * 0xffffff);
}

var meshA = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 3),
  new THREE.MeshBasicMaterial({
    color: "blue",
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5,
  })
);
meshA.position.set(15, 0, 2);
scene.add(meshA);

var meshB = new THREE.Mesh(
  new THREE.SphereGeometry(2.5, 16, 12),
  new THREE.MeshBasicMaterial({
    color: "red",
  })
);
meshB.position.set(15, 0, -3);
scene.add(meshB);

var points: Vector3[] = [];
for (let i = -3; i <= 3; i++) {
  let point = new THREE.Vector3().copy(meshA.position).setComponent(1, i);
  points.push(point);
  let p = new THREE.Mesh(
    new THREE.SphereGeometry(0.125, 4, 2),
    new THREE.MeshBasicMaterial({
      color: "orange",
      wireframe: true,
    })
  );
  p.position.copy(point);
  scene.add(p);
}

document
  .getElementById("pressme")
  .addEventListener("click", getIntersections, false);

document.getElementById("forward").addEventListener("click", forward, false);
document.getElementById("backward").addEventListener("click", backward, false);

function forward() {
  planePolygon.constant += 1;
  var dir = new THREE.Vector3();
	dir.copy(planePolygon.normal);
  camaraAbajo.position.addScaledVector(dir, -1);
}

function backward() {
  planePolygon.constant -= 1;
  var dir = new THREE.Vector3();
	dir.copy(planePolygon.normal);
  camaraAbajo.position.addScaledVector(dir, 1);
}

var raycaster2 = new THREE.Raycaster();
var direction = new THREE.Vector3(0, 0, -1);
var intersects;

function getIntersections() {
  points.forEach((p) => {
    raycaster2.set(p, direction);
    intersects = raycaster2.intersectObject(meshB);
    if (intersects.length > 0) {
      let pI = intersects[0].point; //this is the point of intersection in world coordinates
      console.log(pI);
      // visualization
      let lineGeom = new THREE.Geometry();
      lineGeom.vertices.push(p, pI);
      let line = new THREE.Line(
        lineGeom,
        new THREE.LineBasicMaterial({
          color: "yellow",
        })
      );
      scene.add(line);
      let pointI = new THREE.Mesh(
        new THREE.SphereGeometry(0.125, 4, 2),
        new THREE.MeshBasicMaterial({
          color: "white",
        })
      );
      pointI.position.copy(pI);
      scene.add(pointI);
    }
  });
}

var geom = new THREE.PlaneGeometry(20, 20, 10, 10);
geom.vertices.forEach((v) => {
  v.z = THREE.MathUtils.randFloat(-1, 1);
});
geom.rotateX(-Math.PI * 0.5);
geom.computeFaceNormals();
geom.computeVertexNormals();

console.log(cube);

const cubeFolder = gui.addFolder("Cube");
cubeFolder.add(cube.rotation, "x", 0, Math.PI * 2, 0.01).name("rotation-x");
cubeFolder.add(cube.rotation, "y", 0, Math.PI * 2, 0.01);
cubeFolder.add(cube.rotation, "z", 0, Math.PI * 2, 0.01);
cubeFolder.add(cube.position, "x", -20, 50, 1).name("position-x");
cubeFolder.add(cube.position, "y", -20, 50, 1);
cubeFolder.add(cube.position, "z", -20, 50, 1);
cubeFolder.open();
const cameraFolder = gui.addFolder("Camera");
//cameraFolder.add(cameraHelper1, "visible", false).name("perspective");
cameraFolder.add(camaraArribaIzq.position, "x", -20, 50, 1);
cameraFolder.add(camaraArribaIzq.position, "y", -20, 50, 1);
cameraFolder.add(camaraArribaIzq.position, "z", -20, 50, 1);
cameraFolder.add(cameraHelper2, "visible", false).name("ortho");
cameraFolder.add(camaraArribaDer.position, "x", -20, 50, 1);
cameraFolder.add(camaraArribaDer.position, "y", -20, 50, 1);
cameraFolder.add(camaraArribaDer.position, "z", -20, 50, 1);
cameraFolder.add(camaraArribaDer, "zoom", -20, 50, 1);
cameraFolder.add(camaraAbajo.position, "x", 0, 100, 1).name("all-camera-pos-x");
cameraFolder.add(camaraAbajo.position, "y", 0, 100, 1);
cameraFolder.add(camaraAbajo.position, "z", 0, 100, 1);
cameraFolder
  .add(camaraAbajo.rotation, "x", 0, Math.PI * 2, 0.01)
  .name("rotation-x");
cameraFolder.add(camaraAbajo.rotation, "y", 0, Math.PI * 2, 0.01);
cameraFolder.add(camaraAbajo.rotation, "z", 0, Math.PI * 2, 0.01);
cameraFolder.open();

const axesHelper = new THREE.AxesHelper(5);
axesHelper.name = "axesHelper_1";
axesHelper.position.set(0, 0, 0);
scene.add(axesHelper);

var squareShape = new THREE.Shape();
squareShape.moveTo(0, 0);
squareShape.lineTo(0, 50);
squareShape.lineTo(20, 80);
squareShape.lineTo(50, 50);
squareShape.lineTo(0, 0);

var geometryShape = new THREE.ShapeGeometry(squareShape);
var materialShape = new THREE.LineBasicMaterial({
  linewidth: 10,
  linejoin: "bevel",
});
var meshShape = new THREE.Mesh(geometryShape, materialShape);
scene.add(meshShape);

var animate = function () {
  requestAnimationFrame(animate);

  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  // camaraAbajo.rotation.z += 0.01;
  // camaraArribaIzq.rotation.z += 0.01;

  controlArribaDer.update();
  controlArribaIzq.update();

  rendererArribaIzq.render(scene, camaraArribaIzq);
  rendererArribaDer.render(sceneSection, camaraArribaDer);
  rendererAbajo.render(scene, camaraAbajo);
  // renderer4.render(scene, camera4)
};

animate();
