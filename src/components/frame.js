import { BoxGeometry, Mesh, MeshBasicMaterial, PlaneGeometry, Vector3, Object3D } from 'three';
import { DISPLAY_OFFSET_Y, scene, world } from '../modules/setup';
import { sphereMatrix } from './grid';
import { blueSphereMaterial } from './sphere';

const frameBorder = world.frame.border;

export function createFrame(cornerOne, cornerTwo) {
    const upperLeftCorner = computeUpperLeftCorner(cornerOne, cornerTwo);
    const bottomRightCorner = computeBottomRightCorner(cornerOne, cornerTwo);

    const width = Math.abs(upperLeftCorner.x - bottomRightCorner.x)
    const height = Math.abs(upperLeftCorner.y - bottomRightCorner.y)

    if (width < 1 || height < 1) {
        return
    }

    const frameGeomHorizontal = new BoxGeometry(width, frameBorder, frameBorder)
    const frameGeomVertical = new BoxGeometry(frameBorder, height, frameBorder)


    const horizontalBottomMesh = new Mesh(frameGeomHorizontal, blueSphereMaterial)
    horizontalBottomMesh.position.set(upperLeftCorner.x + (width / 2), bottomRightCorner.y + (frameBorder / 2), 0)

    const horizontalTopMesh = new Mesh(frameGeomHorizontal, blueSphereMaterial)
    horizontalTopMesh.position.set(upperLeftCorner.x + (width / 2), upperLeftCorner.y - (frameBorder / 2), 0)

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

export function createAlignedFrame(positionsOfSpheres) {
    const upperLeftCorner = positionsOfSpheres.reduce((position1, position2) => {
        if (position1 === undefined) {
            return position2;
        }

        if (position2 === undefined) {
            return position1;
        }

        return { x: Math.min(position1.x, position2.x), y: Math.max(position1.y, position2.y) }
    })

    const bottomRightCorner = positionsOfSpheres.reduce((position1, position2) => {
        if (position1 === undefined) {
            return position2;
        }

        if (position2 === undefined) {
            return position1;
        }

        return { x: Math.max(position1.x, position2.x), y: Math.min(position1.y, position2.y) }
    })


    const alignedUpperLeftCorner = { x: upperLeftCorner.x - world.sphere.radius - 0.5, y: upperLeftCorner.y + world.sphere.radius + 0.5 };
    const alignedBottomRightCorner = { x: bottomRightCorner.x + world.sphere.radius + 0.5, y: bottomRightCorner.y - world.sphere.radius - 0.5 };

    return createFrame(alignedUpperLeftCorner, alignedBottomRightCorner);
}

export function detectFramedSpheres(upperLeftCorner, bottomRightCorner) {
    const result = [];
    scene.updateMatrixWorld();
    sphereMatrix.forEach((row) => {
        row.filter((mesh) => {
            const position = new Vector3();
            mesh.getWorldPosition(position)
            return upperLeftCorner.x < position.x && position.x < bottomRightCorner.x && upperLeftCorner.y > position.y && position.y > bottomRightCorner.y
        }).map((mesh) => result.push(mesh))
    });

    return result;
}

// this invisible helper plane defines where frames can be drawn
const plane = new PlaneGeometry(100, 100);
const transparentMaterial = new MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.0 })
export const planeMesh = new Mesh(plane, transparentMaterial)
planeMesh.position.set(0, DISPLAY_OFFSET_Y, 0)
scene.add(planeMesh)
