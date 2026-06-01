import { Component } from "@angular/core";
import { TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { SceneComponent, SceneConfig } from "./scene.component";
import { isMesh } from "./three.utils";


@Component({
    selector: "grail",
    imports: [SceneComponent],
    host: { class: 'grow' },
    template: `
    <scene [config]="config" (AfterSceneInit)="AfterSceneInit($event)"></scene>
`,
})
export class GrailComponent {

    config: Partial<SceneConfig> = {
        cameraPosition: [0, 3, 10],
    }

    public AfterSceneInit(SceneComponent: SceneComponent) {
        const { scene } = SceneComponent;
        const textureLoader = new TextureLoader();
        const leftTex = textureLoader.load("/textures/belt.png");
        const rightTex = textureLoader.load("/textures/belt.png");
        [leftTex, rightTex].forEach(tex => tex.flipY = false);

        const modelLoader = new GLTFLoader();
        modelLoader.load("grail.glb", gltf => {
            gltf.scene.traverse((child) => {
                if (!isMesh(child)) return;
                if (child.name.includes("LeftBelt")) (child.material as any).map = leftTex;
                if (child.name.includes("RightBelt")) (child.material as any).map = rightTex;
            });
            scene.add(gltf.scene);
            gltf.scene.rotation.y = Math.PI;
            gltf.scene.position.y = 0.55;
        });
    }

}