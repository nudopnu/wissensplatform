import { Component } from "@angular/core";
import { TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { SceneComponent, SceneConfig } from "./scene.component";
import { isMesh } from "./three.utils";


@Component({
    selector: "grail",
    imports: [SceneComponent],
    host: { class: 'grow relative' },
    template: `
    <scene [config]="config" (afterSceneInit)="afterSceneInit($event)"></scene>
    <aside class="absolute left-0 top-0">
        <fieldset class="fieldset">
            <legend class="fieldset-legend">Pitch</legend>
            <input type="range" min="0" max="100" value="40" class="range range-primary" />
        </fieldset>
    </aside>
`,
})
export class GrailComponent {

    config: Partial<SceneConfig> = {
        cameraPosition: [0, 3, 10],
    }

    public afterSceneInit(SceneComponent: SceneComponent) {
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