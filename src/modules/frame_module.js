import { Vector3 } from 'three';
import { blueSphereMaterial } from '../components/sphere';
import { createAlignedFrame, createFrame, detectFramedSpheres, planeMesh } from './../components/frame';
import { getPointOnPlane } from './plane_module';
import { scene } from './setup';

let cornerMouseDown = undefined;
let cornerMouseUp = undefined;
let temporaryMouseUp = undefined;
export let newFrame = undefined;
let frames = []

export function drawingAFrame() {
    // I have no idea what this means
    return typeof cornerMouseDown, newFrame !== 'undefined'
}

export function setFrameStart(event) {
    cornerMouseDown = getPointOnPlane(event, planeMesh);
}


export function setFrameEnd(event) {
    cornerMouseUp = getPointOnPlane(event, planeMesh)

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
    }, 30);
}


export function setMovingFrameEnd(event) {
    // if there is already a temporary frame drawn, remove it from the scene
    if (newFrame) {
        scene.remove(newFrame.groupedMesh)
        newFrame = undefined
    }

    temporaryMouseUp = getPointOnPlane(event, planeMesh)

    if (temporaryMouseUp && cornerMouseDown) {
        newFrame = createFrame(cornerMouseDown, temporaryMouseUp)
    }

    if (newFrame) {
        scene.add(newFrame.groupedMesh)
    }
}



export function resetFrames() {
    frames.forEach((frame) => {
        scene.remove(frame.groupedMesh);
        frame.groupedMesh.remove();
    })

    frames = [];
}