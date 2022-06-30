import { ClampToEdgeWrapping } from 'three';
import {
  SphereGeometry, BoxGeometry, WebGLRenderer, DirectionalLight, Scene, MeshPhongMaterial,
  PerspectiveCamera, Mesh, Raycaster
} from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const world = {
  sphere: {
    radius: 2,
    widthSegments: 50,
    heightSegments: 50
  },
  abako: {
    rows: 2,
    columns: 10,
    distanceInRow: 5,
    distanceInColumn: 5
  },
  break: {
    width: 50,
    height: 0.4,
    depth: 0.4
  }
}


// set up scene, raycaster, camera, light and renderer
const scene = new Scene();
const raycaster = new Raycaster();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 45;

// most devices have a bigger heigth than width. This offset helps to display the UI and the canvas on the screen
const DISPLAY_OFFSET_Y = -5

// front light
const frontLight = new DirectionalLight(0xffffff, 1)
frontLight.position.set(0, 0, 10)
scene.add(frontLight)

const renderer = new WebGLRenderer();
// assign id to canvas
renderer.domElement.id = 'abako';
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false;



const redSphereMaterial = new MeshPhongMaterial({ color: 0xff0000 })
const blueSphereMaterial = new MeshPhongMaterial({ color: 0x0000ff })

let sphereGeometry;

function generateGeometry() {
  sphereGeometry = new SphereGeometry(world.sphere.radius, world.sphere.widthSegments, world.sphere.heightSegments)
}

function toggleMaterial(sphere) {
  if (sphere.material === redSphereMaterial) {
    sphere.material = blueSphereMaterial
  } else if (sphere.material === blueSphereMaterial) {
    sphere.material = redSphereMaterial
  }
}

let sphereMatrix = []

function generateSphereMatrix() {
  generateGeometry()
  sphereMatrix.forEach((mesh) => {
    mesh.geometry.dispose()
    scene.remove(mesh)
  })
  sphereMatrix = [];
  for (let column = 0; column < world.abako.columns; column++) {
    let positionX = -1 * ((world.abako.columns - 1) * world.abako.distanceInRow / 2) + column * world.abako.distanceInRow;
    for (let row = 0; row < world.abako.rows; row++) {
      let positionY = -1 * ((world.abako.rows - 1) * world.abako.distanceInColumn / 2) + row * world.abako.distanceInColumn + DISPLAY_OFFSET_Y;
      const sphereMesh = new Mesh(sphereGeometry, redSphereMaterial)
      sphereMesh.position.set(positionX, positionY, 0)
      sphereMatrix.push(sphereMesh)
      scene.add(sphereMesh)
    }
  }
}

generateSphereMatrix()

const breakMaterial = new MeshPhongMaterial({ color: 0x555555 })
let horizontalBreakMesh
let verticalBreakMesh
let breakGeometry


function generateBreaks() {
  if (breakGeometry) {
    breakGeometry.dispose()
    scene.remove(horizontalBreakMesh)
    scene.remove(verticalBreakMesh)
  }

  breakGeometry = new BoxGeometry(world.break.width, world.break.height, world.break.depth)
  horizontalBreakMesh = new Mesh(breakGeometry, breakMaterial)
  horizontalBreakMesh.position.set(0, DISPLAY_OFFSET_Y, 0)
  verticalBreakMesh = new Mesh(breakGeometry, breakMaterial)
  verticalBreakMesh.position.set(0, DISPLAY_OFFSET_Y, 0)
  verticalBreakMesh.rotation.z = Math.PI / 2

  scene.add(horizontalBreakMesh)
  scene.add(verticalBreakMesh)
}


generateBreaks()



const mouse = {
  x: undefined,
  y: undefined
}


// animate
let frame = 0
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  frame += 0.01
}

animate()

document.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  console.log("Click: " + mouse.x + ", " + mouse.y)

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(sphereMatrix)
  if (intersects.length > 0) {
    intersects.forEach((intersect) => {
      toggleMaterial(intersect.object)
    })
  }
})

// rerender when window size changes
window.addEventListener('resize', (event) => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.position.x = 0;
  camera.position.y = 0;
  camera.updateProjectionMatrix();
})

function updateRows(value) {
  world.abako.rows = value;
  generateSphereMatrix();
}

function updateColumns(value) {
  world.abako.columns = value;
  generateSphereMatrix();
}


const rowSlider = document.getElementById("rowSlider");
const columnSlider = document.getElementById("columnSlider");


rowSlider.addEventListener('input', () => updateRows(rowSlider.value));

columnSlider.addEventListener('input', () => updateColumns(columnSlider.value));

const container = document.getElementById('container');
container.appendChild(renderer.domElement);