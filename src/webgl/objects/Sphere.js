import * as THREE from 'three';
import AudioController from '../../components/utils/AudioController';

export default class Sphere {
    constructor() {
        this.geometry = new THREE.BufferGeometry();

        // Augmentez le nombre de segments et d'anneaux pour plus de particules.
        const segments = 100;
        const rings = 100;
        const positions = new Float32Array(segments * rings * 3);
        this.originalPositions = new Float32Array(segments * rings * 3);

        for (let i = 0; i < segments; i++) {
            for (let j = 0; j < rings; j++) {
                const index = (i * rings + j) * 3;
                const phi = (i / segments) * Math.PI * 2;
                const theta = (j / rings) * Math.PI;
                const radius = 15;
                positions[index] = radius * Math.sin(theta) * Math.cos(phi);
                positions[index + 1] = radius * Math.sin(theta) * Math.sin(phi);
                positions[index + 2] = radius * Math.cos(theta);

                // Stockez les positions d'origine.
                this.originalPositions[index] = positions[index];
                this.originalPositions[index + 1] = positions[index + 1];
                this.originalPositions[index + 2] = positions[index + 2];
            }
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.material = new THREE.PointsMaterial({ color: 0x90e0ef });
        this.mesh = new THREE.Points(this.geometry, this.material);
        this.group = new THREE.Group();
        this.group.add(this.mesh);

        // Appliquez une rotation de 90 degrés autour de l'axe X.
        this.group.rotation.x = Math.PI / 2;
    }

    tick() {
        const remapped = AudioController.fdata[0] / 255;

        // Récupérez la position des particules.
        const positions = this.geometry.attributes.position.array;
console.log(remapped);
        // if (remapped > 0) {
            // Faites bouger les points en fonction de la valeur de remapped.
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] = positions[i] * remapped
                positions[i+1] = positions[i+1] * remapped
                positions[i+2] = positions[i+2] * remapped


                // positions[i + 1] += (Math.random() - 0.5) * remapped * 10;
                // positions[i + 2] += (Math.random() - 0.5) * remapped * 10;
            }
        // } else {
        //     // Réinitialisez les positions des particules aux positions d'origine.
        //     for (let i = 0; i < positions.length; i += 3) {
        //         positions[i] = this.originalPositions[i];
        //         positions[i + 1] = this.originalPositions[i + 1];
        //         positions[i + 2] = this.originalPositions[i + 2];
        //     }
        // }

        // Mettez à jour la géométrie des particules.
        this.geometry.attributes.position.needsUpdate = true;
    }
}
