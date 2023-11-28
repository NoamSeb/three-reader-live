import * as THREE from 'three'
import { DoubleSide } from 'three';
import AudioController from '../../components/utils/AudioController';
import Scene from '../Scene';

// eslint-disable-next-line import/no-webpack-loader-syntax
import fragmentShader from "!!raw-loader!!glslify-loader!../../shaders/cover/fragment.glsl";
// eslint-disable-next-line import/no-webpack-loader-syntax
import vertexShader from "!!raw-loader!!glslify-loader!../../shaders/cover/vertex.glsl";

export default class Cube {
    constructor() {
        this.geometry = new THREE.PlaneGeometry(20, 20, 512, 512);
        this.material = new THREE.ShaderMaterial({
            // wireframe: false,
            
            uniforms: {
                uMap: {value:null},
                uBassFrequency: {value: 0},
                uTime: {value:0}
            },
            side: THREE.DoubleSide,
            fragmentShader: fragmentShader,
            vertexShader: vertexShader,
        });
        this.mesh = new THREE.Points(this.geometry, this.material);

        this.group = new THREE.Group();
        this.group.add(this.mesh);
    }
    updateCover(src) {
        console.log((src));

        Scene.textureLoader.load(src, (texture) => {
            console.log(texture);
            // this.material.map = texture;
            
            this.material.uniforms.uMap.value = texture;
            this.material.needsUpdate = true;
        })
    }
    tick(deltaTime) {
        this.material.uniforms.uTime.value += deltaTime * 0.001;
        this.material.uniforms.uBassFrequency.value = AudioController.fdata[0];
    }
}