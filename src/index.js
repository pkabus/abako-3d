import { Vector3 } from 'three';
import { createFrame, planeMesh, detectFramedSpheres, createAlignedFrame } from './components/frame';
import { generateAxis, generateSphereMatrix, resetSpheres, sphereMatrix, updateColumns, updateRows } from './components/grid';
import { blueSphereMaterial, toggleMaterial } from './components/sphere';
import { camera, raycaster, renderer, scene } from './modules/setup';



// generate initial matrix with rows/columns set in world (see setup)
generateSphereMatrix()



// generate axis
generateAxis()



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
  if (newFrame) {
    return;
  }

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


let cornerMouseDown = undefined;
let cornerMouseUp = undefined;
let temporaryMouseUp = undefined;
let newFrame = undefined;
let frames = []

function setPoint(event) {
  const localMouse = { x: (event.clientX / window.innerWidth) * 2 - 1, y: -(event.clientY / window.innerHeight) * 2 + 1 }
  raycaster.setFromCamera(localMouse, camera)

  let point = undefined;

  const intersects = raycaster.intersectObject(planeMesh)
  if (intersects.length === 1) {
    const intersection = intersects[0];
    point = { x: intersection.point.x, y: intersection.point.y }
  }

  return point;
}

document.addEventListener('pointermove', (event) => drawMove(event), true);
document.addEventListener('pointerdown', (event) => drawStart(event), true);
document.addEventListener('pointerup', (event) => drawEnd(event), true);

function drawStart(event) {
  cornerMouseDown = setPoint(event);
}


function drawEnd(event) {
  cornerMouseUp = setPoint(event)

  // the user frame represents the user input
  let userFrame = undefined
  // if both points are set, create a frame
  if (cornerMouseDown && cornerMouseUp) {
    userFrame = createFrame(cornerMouseDown, cornerMouseUp);
  }

  // the final represents the framed aligned to the affected spheres
  let finalFrame = undefined

  // detect affected spheres
  let positions = [];
  if (userFrame) {
    const framedSpheres = detectFramedSpheres(userFrame.upperLeftCorner, userFrame.bottomRightCorner);
    framedSpheres.forEach((mesh) => mesh.material = blueSphereMaterial);

    positions = framedSpheres.map((mesh) => {
      const position = new Vector3();
      mesh.getWorldPosition(position);
      return position;
    });
  }

  console.debug('Frame ' + positions.length + ' spheres.')
  // length gives us the number of spheres affected
  if (positions.length > 0) {
    finalFrame = createAlignedFrame(positions);
  }

  if (finalFrame) {
    scene.add(finalFrame.groupedMesh)
    frames.push(finalFrame)
  }

  if (newFrame) {
    scene.remove(newFrame.groupedMesh);
  }

  cornerMouseDown = undefined;
  temporaryMouseUp = undefined;
  cornerMouseUp = undefined;

  // need a delay here to signal the "click" event to not change a sphere if a frame has been drawn
  setTimeout(() => {
    newFrame = undefined;
  }, 50);
}


function drawMove(event) {
  // a mouse move without a mousedown is not interesting
  if (!cornerMouseDown) {
    return;
  }

  // if there is already a temporary frame drawn, remove it from the scene
  if (newFrame) {
    scene.remove(newFrame.groupedMesh)
    newFrame = undefined
  }

  temporaryMouseUp = setPoint(event)

  if (temporaryMouseUp && cornerMouseDown) {
    newFrame = createFrame(cornerMouseDown, temporaryMouseUp)
  }

  if (newFrame) {
    scene.add(newFrame.groupedMesh)
  }
}


// rerender when window size changes
window.addEventListener('resize', (event) => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.position.x = 0;
  camera.position.y = 0;
  camera.updateProjectionMatrix();
})

function resetFrames() {
  frames.forEach((frame) => {
    scene.remove(frame.groupedMesh);
    frame.groupedMesh.remove();
  })

  frames = [];
}

function resetAll() {
  resetFrames();
  resetSpheres();
}

const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", () => resetAll());


const rowSlider = document.getElementById("rowSlider");
const columnSlider = document.getElementById("columnSlider");


rowSlider.addEventListener('input', () => {
  resetFrames();
  updateRows(rowSlider.value)
});
columnSlider.addEventListener('input', () => {
  resetFrames();
  updateColumns(columnSlider.value)
});

const container = document.getElementById('container');
container.appendChild(renderer.domElement);