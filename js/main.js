import * as THREE from 'three';
import { OrbitControls } from '../three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from '../three/examples/jsm/loaders/FBXLoader.js';

let scene, camera, renderer, controls, mixer;
let actions = []; // Aquí guardaremos las animaciones
let currentAction = 0; // Índice de la animación actual
let clock = new THREE.Clock(); // Reloj para el mixer de animaciones
let model; // Guardaremos el modelo cargado

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202020);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 3);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    scene.add(light);

    // Cargar el primer modelo y sus animaciones
    loadModelAndAnimations('../fbx/Short Left Side Step.fbx');

    window.addEventListener('resize', onWindowResize);

    // Añadir evento de teclado para cambiar animaciones
    window.addEventListener('keydown', onKeyDown);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Función para cargar el modelo y sus animaciones
function loadModelAndAnimations(fbxPath) {
    const loader = new FBXLoader();
    loader.load(fbxPath, (object) => {
        if (model) {
            // Si ya hay un modelo cargado, lo eliminamos
            scene.remove(model);
        }

        model = object;
        mixer = new THREE.AnimationMixer(object);

        // Aquí vamos a cargar varias animaciones
        actions = [];
        if (object.animations.length > 0) {
            object.animations.forEach((anim, index) => {
                const action = mixer.clipAction(anim);
                action.setLoop(THREE.LoopRepeat, Infinity); // Repetir animaciones
                actions.push(action);
                if (index === 0) {
                    action.play(); // Empezar con la primera animación
                }
            });
        }

        // Posición y escala del modelo
        object.position.set(0, 0, 0);
        object.scale.set(0.01, 0.01, 0.01);
        object.rotation.y = Math.PI;

        scene.add(object);
    });
}

// Función para cambiar de animación con el teclado
function onKeyDown(event) {
    const key = event.key.toLowerCase();
    let nextAction = currentAction;
    let newFBXPath = '';

    if (key === '1') {
        nextAction = 0; 
        newFBXPath = '../fbx/Short Left Side Step.fbx'; // Path de la animación 1
    } else if (key === '2') {
        nextAction = 1;
        newFBXPath = '../fbx/Taunt.fbx'; // Path de la animación 2
    } else if (key === '3') {
        nextAction = 2;
        newFBXPath = '../fbx/Punching Bag.fbx'; // Path de la animación 3
    } else if (key === '4') {
        nextAction = 3;
        newFBXPath = '../fbx/Martelo 2.fbx'; // Path de la animación 4
    } else if (key === '5') {
        nextAction = 4;
        newFBXPath = '../fbx/Receive Uppercut To The Face.fbx'; // Path de la animación 5
    }else if (key=='6'){
        nextAction = 5;
        newFBXPath = '../fbx/Boxing.fbx'; 
    }

    if (newFBXPath !== '') {
        // Desvanecer la animación actual y cargar una nueva animación
        actions[currentAction].fadeOut(0.5); // Desvanecer la animación actual
        loadModelAndAnimations(newFBXPath); // Cargar el nuevo modelo con animación
        currentAction = nextAction; // Actualizar la animación actual
    }
}

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta(); // Tiempo entre frames para animaciones

    if (mixer) mixer.update(delta);

    controls.update();
    renderer.render(scene, camera);
}
