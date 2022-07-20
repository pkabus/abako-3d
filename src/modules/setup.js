import {
    WebGLRenderer, DirectionalLight, Scene, PerspectiveCamera, Raycaster,
} from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export const world = {
    sphere: {
        radius: 2,
        widthSegments: 50,
        heightSegments: 50
    },
    abako: {
        rows: 2,
        columns: 10,
        distanceInRow: 5,
        distanceInColumn: 5
    },
    break: {
        width: 50,
        height: 0.4,
        depth: 0.4
    },
    frame: {
        border: 0.3
    }
}


// set up scene, raycaster, camera, light and renderer
export const scene = new Scene();
export const raycaster = new Raycaster();
export const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 45;

// most devices have a bigger heigth than width. This offset helps to display the UI and the canvas on the screen
export const DISPLAY_OFFSET_Y = -5

// front light
export const frontLight = new DirectionalLight(0xffffff, 1)
frontLight.position.set(0, 0, 10)
scene.add(frontLight)

export const renderer = new WebGLRenderer();
// assign id to canvas
renderer.domElement.id = 'abako';
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

export const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false;