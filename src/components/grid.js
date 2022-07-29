import { Mesh } from 'three';
import { DISPLAY_OFFSET_Y, scene, world } from '../modules/setup';
import { blueSphereMaterial, redSphereMaterial, sphereGeometry } from './sphere';


export let sphereMatrix = []

export function generateSphereMatrix() {
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
            if (sphereMatrix[row] && sphereMatrix[row][column] && sphereMatrix[row][column].material === blueSphereMaterial) {
                sphereMesh = new Mesh(sphereGeometry, blueSphereMaterial)
            } else {
                sphereMesh = new Mesh(sphereGeometry, redSphereMaterial)
            }

            sphereMesh.position.set(positionX, positionY, 0)
            scene.add(sphereMesh)
            newMatrix[row][column] = sphereMesh;
        }
    }

    sphereMatrix = newMatrix;
}

export function resetSpheres() {
    sphereMatrix.forEach((row) => {
        row.forEach((mesh) => mesh.material = redSphereMaterial)
    })
}

export function updateRows(value) {
    world.abako.rows = value;
    generateSphereMatrix();
}

export function updateColumns(value) {
    world.abako.columns = value;
    generateSphereMatrix();
}