import * as THREE from "three";
import { gsap } from "gsap";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import Stats from "three/examples/jsm/libs/stats.module.js";
import pane from "../components/utils/Pane";

import Cube from "./objects/Cube";
import Line from "./objects/Line";
import Sphere from "./objects/Sphere";
import Board from "./objects/Board";
import Cover from "./objects/Cover";


class SCENE {
    setup(canvas) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas = canvas;

        this.setupScene();
        this.setupCamera();
        this.setupOrbit();
        this.setupStats();
        this.setupRenderer();
        this.setupPostprecessing();
        this.setupTextureLoader();

        this.addObjects();
        this.addEvents();
    }
    setupTextureLoader() {
        this.textureLoader = new THREE.TextureLoader();
    }
    setupScene() {
        this.scene = new THREE.Scene();
    }

    setupStats() {
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            28,
            this.width / this.height,
            0.1,
            10000
        );
        this.camera.position.z = 6;
    }
    setupOrbit() {
        this.control = new OrbitControls(this.camera, this.canvas)
    }
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: false,
            powerPreference: "high-performance",
            stencil: false,
            depth: false,
            alpha: true
        });

        this.renderer.toneMapping = THREE.NoToneMapping;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;

        this.renderer.setClearColor(0x000000);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    setupPostprecessing() {
        this.BLOOM_PARAMS = {
            strenght: 0.4,
            radius: 3.8,
            threshold: 0
        }

        this.composer = new EffectComposer(this.renderer)
        this.scenePass = new RenderPass(this.scene, this.camera)
        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(this.width / this.height),
            this.BLOOM_PARAMS.strenght,
            this.BLOOM_PARAMS.radius,
            this.BLOOM_PARAMS.threshold
        )

        this.composer.addPass(this.scenePass);
        this.composer.addPass(this.bloomPass);

        this.postProcessFolder = pane.addFolder({
            title: 'postprocess',
        });

        this.postProcessFolder.addBinding(this.BLOOM_PARAMS, "strenght", {
            min: 0,
            max: 10,
            step: 0.1,
            label: "Bloom"
        }).on('change', (e) => {
            this.bloomPass.strength = e.value
        })
        this.postProcessFolder.addBinding(this.BLOOM_PARAMS, "radius", {
            min: 0,
            max: 10,
            step: 0.1,
            label: "radius"
        }).on('change', (e) => {
            this.bloomPass.radius = e.value
        })
        this.postProcessFolder.addBinding(this.BLOOM_PARAMS, "threshold", {
            min: 0,
            max: 1,
            step: 0.1,
            label: "Seuil"
        }).on('change', (e) => {
            this.bloomPass.threshold = e.value
        })
    }
    addEvents() {
        gsap.ticker.add(this.tick);
        window.addEventListener('resize', () => this.resize());
    }
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer.setSize(this.width, this.height);

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }
    addObjects() {
        this.cube = new Cube();

        this.sphere = new Sphere();

        this.line = new Line();

        this.board = new Board();

        this.cover = new Cover();

        this.selectedObject = this.cube;
        this.scene.add(this.selectedObject.group);
    }
    changeVisualizer(index) {
        this.scene.remove(this.selectedObject.group)
        switch (index) {
            case 0:
                this.selectedObject = this.cube;
                this.camera.position.z = 6;
                break;
            case 1:
                this.selectedObject = this.line;
                this.camera.position.z = 600;
                break;
            case 2:
                this.selectedObject = this.sphere;
                this.camera.position.z = 150;
                break
            case 3:
                this.selectedObject = this.board;
                this.camera.position.z = 100;
                this.BLOOM_PARAMS.strength = 0.2;
                break
            case 4:
                this.selectedObject = this.cover;
                this.camera.position.z = 6;
                this.bloomPass.strength = 0;
                break
            default:
                break;
        }
        this.scene.add(this.selectedObject.group);
    }
    tick = (time, deltaTime, frame) => {
        this.stats.begin();

        // this.cube.tick();
        // this.sphere.tick();
        // this.line.tick();

        this.selectedObject.tick(deltaTime)

        // this.renderer.render(this.scene, this.camera);

        this.composer.render()

        this.stats.end();
    }
}

const Scene = new SCENE();
export default Scene;