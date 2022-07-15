import { BoxGeometry, Mesh, MeshBasicMaterial, PlaneGeometry, Vector3, Object3D } from 'three';
import { DISPLAY_OFFSET_Y, scene } from '../modules/setup';
import { sphereMatrix } from './grid';
import { blueSphereMaterial } from './sphere';


export function createFrame(cornerOne, cornerTwo) {
    const upperLeftCorner = computeUpperLeftCorner(cornerOne, cornerTwo);
    const bottomRightCorner = computeBottomRightCorner(cornerOne, cornerTwo);

    const width = Math.abs(upperLeftCorner.x - bottomRightCorner.x)
    const height = Math.abs(upperLeftCorner.y - bottomRightCorner.y)

    if (width < 2 || height < 2) {
        console.debug('Frame too small. Cancel.')
        return
    }

    const frameGeomHorizontal = new BoxGeometry(width, 0.2, 0.2)
    const frameGeomVertical = new BoxGeometry(0.2, height, 0.2)


    const horizontalBottomMesh = new Mesh(frameGeomHorizontal, blueSphereMaterial)
    horizontalBottomMesh.position.set(upperLeftCorner.x + (width / 2), bottomRightCorner.y, 0)

    const horizontalTopMesh = new Mesh(frameGeomHorizontal, blueSphereMaterial)
    horizontalTopMesh.position.set(upperLeftCorner.x + (width / 2), upperLeftCorner.y, 0)

    const verticalLeftMesh = new Mesh(frameGeomVertical, blueSphereMaterial)
    verticalLeftMesh.position.set(upperLeftCorner.x, upperLeftCorner.y - (height / 2), 0)

    const verticalRightMesh = new Mesh(frameGeomVertical, blueSphereMaterial)
    verticalRightMesh.position.set(bottomRightCorner.x, bottomRightCorner.y + (height / 2), 0)

    const group = new Object3D();
    group.add(horizontalTopMesh);
    group.add(horizontalBottomMesh);
    group.add(verticalLeftMesh);
    group.add(verticalRightMesh);

    return { groupedMesh: group, upperLeftCorner: upperLeftCorner, bottomRightCorner: bottomRightCorner };
}

function computeUpperLeftCorner(cornerOne, cornerTwo) {
    const x = cornerOne.x < cornerTwo.x ? cornerOne.x : cornerTwo.x;
    const y = cornerOne.y > cornerTwo.y ? cornerOne.y : cornerTwo.y;

    return { x: x, y: y }
}

function computeBottomRightCorner(cornerOne, cornerTwo) {
    const x = cornerOne.x > cornerTwo.x ? cornerOne.x : cornerTwo.x;
    const y = cornerOne.y < cornerTwo.y ? cornerOne.y : cornerTwo.y;

    return { x: x, y: y }
}

export function detectFramedSpheres(frame) {
    const upperLeftCorner = frame.upperLeftCorner;
    const bottomRightCorner = frame.bottomRightCorner;

    const result = [];
    scene.updateMatrixWorld()
    sphereMatrix.forEach((row) => {
        row.filter((mesh) => {
            const position = new Vector3();
            mesh.getWorldPosition(position)
            return upperLeftCorner.x < position.x && position.x < bottomRightCorner.x && upperLeftCorner.y > position.y && position.y > bottomRightCorner.y
        }).map((mesh) => result.push(mesh))
    });

    return result;
}


const plane = new PlaneGeometry(100, 100);
const transparentMaterial = new MeshBasicMaterial({ color: 0x000000, transparent: true })
export const planeMesh = new Mesh(plane, transparentMaterial)
planeMesh.position.set(0, DISPLAY_OFFSET_Y, 0)
scene.add(planeMesh)
