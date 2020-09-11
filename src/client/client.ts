import * as THREE from '/build/three.module.js'
import { OrbitControls } from '/jsm/controls/OrbitControls'
import {GUI} from '/jsm/libs/dat.gui.module'
import {SceneUtils} from '/jsm/utils/SceneUtils'
import {DecalGeometry} from "/jsm/geometries/DecalGeometry"

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
const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity:0.3})
let uniforms = {
  colorB: {type: 'vec3', value: new THREE.Color(0xACB6E5)},
  colorA: {type: 'vec3', value: new THREE.Color(0x74ebd5)}
}

let materialShared =  new THREE.ShaderMaterial({
  uniforms: uniforms,
  fragmentShader: fragmentShader(),
  vertexShader: vertexShader(),
})

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
//cube.position.y = 5
scene.add(cube)

var materialLine = new THREE.LineBasicMaterial({
	color: 0x0000ff
});

var points = [];
points.push( new THREE.Vector3( - 10, 0, 1 ) );
points.push( new THREE.Vector3( -10, 5, -1 ) );
points.push( new THREE.Vector3( -10, 7.4, 4 ) );

var geometryLine = new THREE.BufferGeometry().setFromPoints( points );

var line = new THREE.Line( geometryLine, materialLine );
scene.add( line );

function updateMaterial() {
    material.side = Number(material.side)
    material.combine = Number(material.combine)
    material.needsUpdate = true
}

var geometryPlane = new THREE.PlaneGeometry( 5, 20, 32 );
var materialPlane = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
var plane = new THREE.Mesh( geometryPlane, materialPlane );
plane.position.set(10,0,0)
plane.rotateY(Math.PI/2)
scene.add( plane );

var direction = new THREE.Vector3();
var far = new THREE.Vector3();
var intersects;

var objects = [];
objects.push(cube)

const raycaster = new THREE.Raycaster()
raycaster.set(line.position, direction.subVectors(plane.position, line.position).normalize());
  //raycaster.far = far.subVectors(plane.position, line.position).length(); // comment this line to have an infinite ray
  intersects = raycaster.intersectObject(cube);
  console.log(intersects)
  for (let i = 0; i < intersects.length; i++) {
    intersects[i].object.material.color.set(Math.random() * 0xffffff);
  }

  var meshA = new THREE.Mesh(new THREE.PlaneGeometry(2, 3), new THREE.MeshBasicMaterial({
    color: "blue",
    side: THREE.DoubleSide,
    transparent: true,
    opacity: .5
  }));
  meshA.position.set(15, 0, 2);
  scene.add(meshA);
  
  var meshB = new THREE.Mesh(new THREE.SphereGeometry(2.5, 16, 12), new THREE.MeshBasicMaterial({
    color: "red"
  }));
  meshB.position.set(15, 0, -3);
  scene.add(meshB);
  
  var points = [];
  for (let i = -3; i <= 3; i++) {
    let point = new THREE.Vector3().copy(meshA.position).setComponent(1, i);
    points.push(point);
    let p = new THREE.Mesh(new THREE.SphereGeometry(.125, 4, 2), new THREE.MeshBasicMaterial({
      color: "orange",
      wireframe: true
    }));
    p.position.copy(point);
    scene.add(p);
  }
  

  document.getElementById("pressme").addEventListener("click", getIntersections, false);
  
  var raycaster2 = new THREE.Raycaster();
  var direction = new THREE.Vector3(0, 0, -1);
  var intersects;
  
  function getIntersections() {
    points.forEach(p => {
      raycaster2.set(p, direction);
      intersects = raycaster2.intersectObject(meshB);
      if (intersects.length > 0) {
        let pI = intersects[0].point; //this is the point of intersection in world coordinates
        console.log(pI);
        // visualization
        let lineGeom = new THREE.Geometry();
        lineGeom.vertices.push(p, pI);
        let line = new THREE.Line(lineGeom, new THREE.LineBasicMaterial({
          color: "yellow"
        }));
        scene.add(line);
        let pointI = new THREE.Mesh(new THREE.SphereGeometry(.125, 4, 2), new THREE.MeshBasicMaterial({
          color: "white"
        }));
        pointI.position.copy(pI);
        scene.add(pointI);
      }
    });
}

var geom = new THREE.PlaneGeometry(20, 20, 10, 10);
geom.vertices.forEach(v => {
  v.z = THREE.MathUtils.randFloat(-1, 1);
});
geom.rotateX(-Math.PI * .5);
geom.computeFaceNormals();
geom.computeVertexNormals();

console.log(cube)

var decalGeometry = new DecalGeometry(
  meshA, 
  new THREE.Vector3(0,1,0),      //position
  new THREE.Euler( -1, 0, 1, 'XYZ' ),      //direction
  new THREE.Vector3(5,5,5)   //dimensions
);
var decalmaterial = new THREE.MeshBasicMaterial( { color: 0xff00ff } );
var mesh = new THREE.Mesh( decalGeometry, decalmaterial );
scene.add( mesh );

function mixVertexShader()
{
  return `
  varying vec2 vPos;
  void main() {
    vPos = position.xz;
    gl_Position = projectionMatrix *
                  modelViewMatrix *
                  vec4(position,1.0);
  }
`;
}

function MixFragmentShader()
{
  return `
  uniform vec3 center;
  uniform vec2 size;
  uniform float lineHalfWidth;
  
  varying vec2 vPos;
  
  void main() {
    vec2 Ro = size * .5;
    vec2 Uo = abs( vPos - center.xz ) - Ro;
    
    vec3 c = mix(vec3(1.), vec3(1.,0.,0.), float(abs(max(Uo.x,Uo.y)) < lineHalfWidth));
    
    gl_FragColor = vec4(c, 0.5  );
  }
  
`;
}

var newuniforms = {
  center: {
    value: new THREE.Vector3(-6,0,0)
  },
  size: {
    value: new THREE.Vector2(1, 1)
  },
  lineHalfWidth: {
    value: 2
  }
}

var matShader = new THREE.ShaderMaterial({
  uniforms: newuniforms,
  vertexShader: mixVertexShader(),
  fragmentShader: MixFragmentShader()
});

var matWire = new THREE.MeshBasicMaterial({
  color: "gray",
  wireframe: true
});

var obj = SceneUtils.createMultiMaterialObject(geom, [matShader, matWire]);
obj.position.set(-30,0,0)

scene.add(obj);

var mouse = new THREE.Vector2();
var point = new THREE.Vector3();

// window.addEventListener("mousemove", function(event) {
//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//   raycaster.setFromCamera(mouse, camera3);
//   intersects = raycaster.intersectObject(obj, true);
//   if (intersects.length === 0) return;
//   obj.worldToLocal(point.copy(intersects[0].point));
//   newuniforms.center.value.copy(point);

// }, false);

function vertexShader() {
  return `
    varying vec3 vUv; 

    void main() {
      vUv = position; 

      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition; 
    }
  `
}

function fragmentShader() {
return `
uniform vec3 colorA; 
uniform vec3 colorB; 
varying vec3 vUv;

void main() {
  gl_FragColor = vec4(mix(colorA, colorB, vUv.x), 1.0);
}
`
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

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    controls.update()
   // controls2.update()

    renderer1.render(scene, camera1)
    renderer2.render(scene, camera2)
    renderer3.render(scene, camera3)
    // renderer4.render(scene, camera4)
};

animate();