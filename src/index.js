import {
  SphereGeometry, BoxGeometry, WebGLRenderer, DirectionalLight, Scene, MeshPhongMaterial,
  PerspectiveCamera, Mesh, Raycaster
} from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import dat from 'dat.gui';

// set up dat.gui
const gui = new dat.GUI()
const world = {
  sphere: {
    radius: 2,
    widthSegments: 30,
    heightSegments: 30
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

gui.add(world.sphere, 'radius', 0.1, 10).onChange(generateSphereMatrix)
gui.add(world.sphere, 'widthSegments', 1, 50).onChange(generateSphereMatrix)
gui.add(world.sphere, 'heightSegments', 1, 50).onChange(generateSphereMatrix)
gui.add(world.abako, 'rows', 1, 10).step(1).onChange(generateSphereMatrix)
gui.add(world.abako, 'columns', 1, 10).step(1).onChange(generateSphereMatrix)
gui.add(world.abako, 'distanceInRow', 5, 50).onChange(generateSphereMatrix)
gui.add(world.abako, 'distanceInColumn', 5, 50).onChange(generateSphereMatrix)
gui.add(world.break, 'width', 10, 100).onChange(generateBreaks)
gui.add(world.break, 'height', 0.1, 5).onChange(generateBreaks)
gui.add(world.break, 'depth', 0.1, 5).onChange(generateBreaks)



// set up scene, raycaster, camera, light and renderer
const scene = new Scene();
const raycaster = new Raycaster();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 35;

// front light
const frontLight = new DirectionalLight(0xffffff, 1)
frontLight.position.set(0, 0, 10)
scene.add(frontLight)

const renderer = new WebGLRenderer();
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
      let positionY = -1 * ((world.abako.rows - 1) * world.abako.distanceInColumn / 2) + row * world.abako.distanceInColumn;
      const sphereMesh = new Mesh(sphereGeometry, redSphereMaterial)
      console.log(positionX + ", " + positionY)
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
  verticalBreakMesh = new Mesh(breakGeometry, breakMaterial)
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

window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(sphereMatrix)
  if (intersects.length > 0) {
    intersects.forEach((intersect) => {
      toggleMaterial(intersect.object)
    })
  }
})


document.body.appendChild(renderer.domElement);