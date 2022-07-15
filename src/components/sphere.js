import {
    SphereGeometry, MeshPhongMaterial, Color
} from 'three';
import { world } from '../modules/setup';

export const redSphereColor = new Color(0xff0000)
export const blueSphereColor = new Color(0x0000ff)
export const redSphereMaterial = new MeshPhongMaterial({ color: redSphereColor });
export const blueSphereMaterial = new MeshPhongMaterial({ color: blueSphereColor });
export const sphereGeometry = new SphereGeometry(world.sphere.radius, world.sphere.widthSegments, world.sphere.heightSegments)

export function toggleMaterial(sphere) {
    if (sphere.material === redSphereMaterial) {
        sphere.material = blueSphereMaterial
    } else if (sphere.material === blueSphereMaterial) {
        sphere.material = redSphereMaterial
    }
}