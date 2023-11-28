import * as THREE from 'three'
import AudioController from '../../components/utils/AudioController';

export default class Line {
    constructor() {
        this.group = new THREE.Group();

        this.colors = [0xff000, 0xff7f00, 0xffff00, 0x00ff00, 0x0000ff, 0x4b0082, 0x8f00ff]

        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshNormalMaterial();

        this.materials = []

        this.colors.forEach(color => {
            const material = new THREE.MeshBasicMaterial({
                color,
            })
            this.materials.push(material)
        });

        let n = 0;
        const MODULO = Math.round(256/this.colors.length)
        this.SPACING =  1.5;

        for (let i = 0; i < 256; i++) {
            if(i % MODULO ===0){
                n++;
            }
            const mesh = new THREE.Mesh(this.geometry, this.materials[n-1]);

            mesh.position.x = i * this.SPACING;

            this.group.add(mesh)
        }
        this.group.position.set((-256 * this.SPACING)/2, 0, 0)
    }
    tick() {
        for (let i = 0; i < this.group.children.length; i++) {
            this.group.children[i].scale.y = AudioController.fdata[i];
        }
     }
}