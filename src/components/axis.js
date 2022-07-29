import { BoxGeometry, Mesh, MeshPhongMaterial } from 'three';
import { DISPLAY_OFFSET_Y, scene, world } from '../modules/setup';


const axisMaterial = new MeshPhongMaterial({ color: 0x555555 })
let horizontalAxisMesh
let verticalAxisMesh
let axisGeometry

export function generateAxis() {
    if (axisGeometry) {
        axisGeometry.dispose()
        scene.remove(horizontalAxisMesh)
        scene.remove(verticalAxisMesh)
    }

    axisGeometry = new BoxGeometry(world.break.width, world.break.height, world.break.depth)
    horizontalAxisMesh = new Mesh(axisGeometry, axisMaterial)
    horizontalAxisMesh.position.set(0, DISPLAY_OFFSET_Y, -2)
    verticalAxisMesh = new Mesh(axisGeometry, axisMaterial)
    verticalAxisMesh.position.set(0, DISPLAY_OFFSET_Y, -2)
    verticalAxisMesh.rotation.z = Math.PI / 2

    scene.add(horizontalAxisMesh)
    scene.add(verticalAxisMesh)
}