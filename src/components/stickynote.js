import { Mesh, MeshBasicMaterial, Object3D, PlaneGeometry } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { DISPLAY_OFFSET_Y, scene, world } from '../modules/setup';


const positionZ = world.sphere.radius + 1
let textMesh = undefined;
let stickynoteMesh = undefined;
export let stickynoteObject = undefined;
let textGeometry = undefined;
const textMaterial = new MeshBasicMaterial({ color: 0x000000 })
const loader = new FontLoader();
const planeMaterial = new MeshBasicMaterial({ color: 0xeeeeee, transparent: true, opacity: 0.9 })

function createNotePlane(width = 20, height = 20) {
    const plane = new PlaneGeometry(width, height);
    const notePlaneMesh = new Mesh(plane, planeMaterial)
    notePlaneMesh.position.set(world.stickynote.startX, world.stickynote.startY, positionZ)

    return notePlaneMesh;
}

export function generateStickynote(text) {
    loader.load('/fonts/helvetiker_regular.typeface.json', function (font) {
        
        textGeometry = new TextGeometry(text, {
            font: font,
            size: world.stickynote.textSize,
            height: world.stickynote.textHeight,
            curveSegments: world.stickynote.curveSegments
        });
        textGeometry.center()
        
        textMesh = new Mesh(textGeometry, textMaterial)
        textMesh.position.set(world.stickynote.startX, world.stickynote.startY, positionZ)
        
        // create plane
        let xCoordinates = [];
        let yCoordinates = [];
        textGeometry.parameters.shapes.forEach((curve) => {
            const points = curve.getPoints(2);
            xCoordinates.push(...points.map((point) => point.x))
            yCoordinates.push(...points.map((point) => point.y))
        })
        const xMin = Math.min(...xCoordinates)
        const xMax = Math.max(...xCoordinates)
        const yMin = Math.min(...yCoordinates)
        const yMax = Math.max(...yCoordinates)
        
        stickynoteMesh = createNotePlane(xMax - xMin + 2, yMax - yMin + 2)
        
        if (stickynoteMesh && textMesh) {
            stickynoteObject = new Object3D();
            stickynoteObject.add(stickynoteMesh);
            stickynoteObject.add(textMesh)
            scene.add(stickynoteObject);
        }
    });

}

// this invisible helper plane defines where stickynote moving area
const plane = new PlaneGeometry(300, 300);
const transparentMaterial = new MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.0 })
export const stickynotePlane = new Mesh(plane, transparentMaterial)
stickynotePlane.position.set(0, DISPLAY_OFFSET_Y, positionZ)
scene.add(stickynotePlane)
