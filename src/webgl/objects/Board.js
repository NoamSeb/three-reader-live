import { _numWithUnitExp } from 'gsap/gsap-core';
import * as THREE from 'three'
import AudioController from '../../components/utils/AudioController';

export default class Board {
    constructor() {
        this.group = new THREE.Group();
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.whiteMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });
        this.purpleMaterial = new THREE.MeshBasicMaterial({
            color:0x8f00ff
        });

        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                let mesh;

                if (y%2 === x%2){
                    mesh = new THREE.Mesh(this.geometry, this.whiteMaterial)
                }else{
                    mesh = new THREE.Mesh(this.geometry, this.purpleMaterial)
                }
                mesh.position.set(y, x, 0)
                this.group.add(mesh)

            }
        }
        this.group.position.set(-8, -8, 0)
        this.group.rotation.y = Math.PI /-6;
        
    }
    tick(deltaTime) {
        for (let i = 0; i < this.group.children.length; i++) {
            this.group.children[i].scale.z = AudioController.fdata[i] * 0.04;
        }
    }
}