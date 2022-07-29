import { generateAxis } from './components/axis';
import { generateSphereMatrix, resetSpheres, sphereMatrix, updateColumns, updateRows } from './components/grid';
import { toggleMaterial } from './components/sphere';
import { generateStickynote } from './components/stickynote';
import { drawingAFrame, resetFrames, setFrameEnd, setFrameStart, setMovingFrameEnd } from './modules/frame_module';
import { camera, raycaster, renderer, scene } from './modules/setup';
import { draggingStickynote, dragStickynote, setMovingStickynote, stopDrag } from './modules/stickynote_module';

// generate initial matrix with rows/columns set in world (see setup)
generateSphereMatrix()

// generate axis
generateAxis()

//const notePlane = createNotePlane();
generateStickynote('test')

// animate
let frame = 0
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  frame += 0.01
}

animate()

// rerender when window size changes
window.addEventListener('resize', (event) => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.position.x = 0;
  camera.position.y = 0;
  camera.updateProjectionMatrix();
})

const mouse = {
  x: undefined,
  y: undefined
}

document.addEventListener('click', (event) => {
  if (drawingAFrame() || draggingStickynote()) {
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


document.addEventListener('pointerdown', (event) => {
  // check whether stickynote is intersected
  dragStickynote(event)
  if (draggingStickynote()) {
    return;
  }

  // maybe a frame shall be drawn
  setFrameStart(event);
}, true);

document.addEventListener('pointermove', (event) => {
  // if stickynote is dragged
  if (draggingStickynote()) {
    setMovingStickynote(event);
    return;
  }

  // 
  if (drawingAFrame()) {
    setMovingFrameEnd(event);
  }
}, true);

document.addEventListener('pointerup', (event) => {
  // if stickynote is dragged
  if (draggingStickynote()) {
    stopDrag(event);
    return;
  }

  // if a frame is drawn
  if (drawingAFrame()) {
    setFrameEnd(event);
    return;
  }
}, true);

function resetAll() {
  resetFrames();
  resetSpheres();
}

// html reset button
const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", () => resetAll());

// html sliders
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

// append render output to html tree
const container = document.getElementById('container');
container.appendChild(renderer.domElement);