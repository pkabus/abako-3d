import { Vector3 } from 'three';
import { stickynoteObject, stickynotePlane, generateStickynote, removeStickynote } from '../components/stickynote';
import { getOffset, getPointOnPlane } from './plane_module';
import { scene } from './setup';

let position = undefined;
let startPoint = undefined;
let endPoint = undefined;
let lastPosition = undefined;

export function draggingStickynote() {
    return typeof position !== 'undefined';
}

function update(event) {
    // update position of stickynote 
    scene.updateMatrixWorld();
    position = new Vector3();
    stickynoteObject.getWorldPosition(position);

    // update start point on stickynote plane
    startPoint = getPointOnPlane(event, stickynotePlane)
}

function moveStickynote(event) {
    endPoint = getPointOnPlane(event, stickynotePlane);
    const offset = getOffset(startPoint, endPoint);

    stickynoteObject.translateX(offset.x)
    stickynoteObject.translateY(offset.y)
}

export function dragStickynote(event) {
    if (!stickynoteObject) {
        return;
    }

    // check if the event hit the stickynote plane
    const point = getPointOnPlane(event, stickynoteObject);

    if (typeof point === 'undefined') {
        return;
    }

    update(event)
}

export function setMovingStickynote(event) {
    // according to previous start point, move to new position
    moveStickynote(event)
    update(event)
}

export function stopDrag(event) {
    moveStickynote(event)

    // remember position to be able to create a new stickynote at the same position
    scene.updateMatrixWorld();
    lastPosition = new Vector3();
    stickynoteObject.getWorldPosition(lastPosition);
    
    // finish drag and drop
    // need a delay here to signal the "click" event to not change a sphere
    setTimeout(() => {
        position = undefined;
    }, 30);
}

export function createStickynote(text) {
    const x = endPoint ? endPoint.x : undefined;
    const y = endPoint ? endPoint.y : undefined;

    removeStickynote();
    generateStickynote(text, x, y);
}