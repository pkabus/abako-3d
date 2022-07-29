import { camera, raycaster } from './setup';

export function getPointOnPlane(event, plane) {
    const localMouse = { x: (event.clientX / window.innerWidth) * 2 - 1, y: -(event.clientY / window.innerHeight) * 2 + 1 }
    raycaster.setFromCamera(localMouse, camera)

    let point = undefined;

    const intersects = raycaster.intersectObject(plane)
    if (intersects.length === 1) {
        const intersection = intersects[0];
        point = { x: intersection.point.x, y: intersection.point.y }
        return point;
    }
}

export function getOffset(startPoint, endPoint) {
    if (!startPoint || !endPoint) {
        return { x: 0, y: 0 }
    }

    return { x: endPoint.x - startPoint.x, y: endPoint.y - startPoint.y }
}