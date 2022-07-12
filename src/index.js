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



const redMaterial = new MeshPhongMaterial({ color: 0xff0000 })
const blueMaterial = new MeshPhongMaterial({ color: 0x0000ff })
const sphereGeometry = new SphereGeometry(world.sphere.radius, world.sphere.widthSegments, world.sphere.heightSegments)

function toggleMaterial(sphere) {
  if (sphere.material === redMaterial) {
    sphere.material = blueMaterial
  } else if (sphere.material === blueMaterial) {
    sphere.material = redMaterial
  }
}

let sphereMatrix = []

function generateSphereMatrix() {
  sphereMatrix.forEach((row) => {
    row.forEach((mesh) => {
      mesh.geometry.dispose()
      scene.remove(mesh)
    })
  })

  const newMatrix = []

  for (let row = 0; row < world.abako.rows; row++) {
    // new rows shall be added at the bottom
    let positionY = 1 * ((world.abako.rows - 1) * world.abako.distanceInColumn / 2) - row * world.abako.distanceInColumn + DISPLAY_OFFSET_Y;
    newMatrix[row] = []
    for (let column = 0; column < world.abako.columns; column++) {
      // new columns shall be added on the right side
      let positionX = -1 * ((world.abako.columns - 1) * world.abako.distanceInRow / 2) + column * world.abako.distanceInRow;

      // decide whether a previous sphere existed. If so, take its material for the new one.
      let sphereMesh = undefined;
      if (sphereMatrix[row] && sphereMatrix[row][column] && sphereMatrix[row][column].material === blueMaterial) {
        sphereMesh = new Mesh(sphereGeometry, blueMaterial)
      } else {
        sphereMesh = new Mesh(sphereGeometry, redMaterial)
      }

      sphereMesh.position.set(positionX, positionY, 0)
      scene.add(sphereMesh)
      newMatrix[row][column] = sphereMesh;
    }
  }

  sphereMatrix = newMatrix;
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

  raycaster.setFromCamera(mouse, camera)

  let spheres = []
  sphereMatrix.forEach((row) => spheres.push(...row));
  const intersects = raycaster.intersectObjects(spheres)
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