import { Component, computed, signal } from "@angular/core";
import { Object3D, RepeatWrapping, Texture, TextureEventMap, TextureLoader, Timer } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { SceneConfig } from "../../models/scene-config.model";
import { parseCommands, Sequence } from "../../models/sequence";
import { TreadmillState } from "../../models/treadmill-state";
import { DrawerComponent } from "../daisy/drawer.component";
import { SliderComponent } from "../daisy/slider.component";
import { TextFieldComponent } from "../daisy/textfield.component";
import { SceneComponent } from "./scene.component";
import { isMesh } from "./three.utils";


@Component({
    selector: "grail",
    imports: [SceneComponent, SliderComponent, TextFieldComponent, DrawerComponent],
    host: { class: 'grow relative h-full flex flex-col' },
    template: `
    <scene (afterSceneInit)="afterSceneInit($event)" (onAnimate)="onAnimate($event)"></scene>
    <aside class="absolute left-0 top-0 w-72 p-5 bottom-0 flex flex-col gap-4 pointer-events-none">
        <code>Pitch: {{ pitch() }}</code>
        <code>Sway: {{ sway() }}</code>
        <code>LBS: {{ lbs() }}</code>
        <code>RBS: {{ rbs() }}</code>
    </aside>
    <drawer>
        <div class="divider">Basiszustand</div>

        <slider label="Pitch" [min]="-10" [max]="10" [(value)]="basePitch"></slider>
        <slider label="Sway" [min]="-0.05" [max]="0.05" [step]="0.01" [(value)]="baseSway"></slider>
        <slider label="Speed" [min]="-3" [max]="7" [step]="0.1" [(value)]="baseSpeed"></slider>
        <button class="btn" (click)="onResetControls()">Zurücksetzen</button>

        <div class="divider">Neue Sequenz</div>
        
        <textfield label="Name" [(value)]="sequenceName" placeholder="Beispiel: Testsequenz"></textfield>
        <textfield label="Bedingung" [(value)]="sequenceConditionText" placeholder="Beispiel: fp1.z < -40"></textfield>
        <textfield label="Sequenz" [(value)]="sequenceText" [area]="true" placeholder="Beispiel:\nlbs -3\nrbs -3\nwait 50"></textfield>
        @if (sequenceError()) {
            <p class="text-error text-sm">{{ sequenceError() }}</p>
        }

        <button class="btn btn-primary" (click)="onTestSequence()">Sequenz testen</button>
        <button class="btn btn-accent">Sequenz speichern</button>

        <div class="divider">Verbindung zu D-FLow</div>


    </drawer>
`,
})
export class GrailComponent {

    config: Partial<SceneConfig> = {
        cameraPosition: [0, 3, 10],
    }

    // Base params from sliders
    basePitch = signal(0);
    baseSway = signal(0);
    baseSpeed = signal(1);
    sequenceName = signal("");
    sequenceConditionText = signal("");
    sequenceText = signal("");
    sequenceError = signal<string | undefined>(undefined);

    // state controlled by sequence
    currentState = signal<TreadmillState>({
        lbs: this.baseSpeed(),
        rbs: this.baseSpeed(),
        pitch: this.basePitch(),
        sway: this.baseSway(),
    });
    currentSequence = signal<Sequence | undefined>(undefined);

    // Actual params
    pitch = computed(() => this.currentSequence() ? this.currentState().pitch : this.basePitch());
    sway = computed(() => this.currentSequence() ? this.currentState().sway : this.baseSway());
    lbs = computed(() => this.currentSequence() ? this.currentState().lbs : this.baseSpeed());
    rbs = computed(() => this.currentSequence() ? this.currentState().rbs : this.baseSpeed());

    timer = new Timer();
    leftOffset = 0;
    rightOffset = 0;

    BELT_LENGTH = 4.68;
    leftTex: Texture<HTMLImageElement, TextureEventMap> | undefined;
    rightTex: Texture<HTMLImageElement, TextureEventMap> | undefined;
    vGait: Object3D | undefined;

    onAnimate(timestamp: number) {
        this.timer.update(timestamp);

        const sequence = this.currentSequence();
        if (sequence) {
            this.currentState.update(sequence.update.bind(sequence));
            if (sequence.hasEnded) {
                this.currentSequence.set(undefined);
            }
        }

        const delta = this.timer.getDelta();
        this.leftOffset -= delta * this.lbs() / this.BELT_LENGTH;
        this.rightOffset -= delta * this.rbs() / this.BELT_LENGTH;
        this.leftOffset %= 1;
        this.rightOffset %= 1;
        if (this.leftTex) this.leftTex.offset.y = this.leftOffset;
        if (this.rightTex) this.rightTex.offset.y = this.rightOffset;

        this.vGait?.rotation.set(this.pitch() * Math.PI / 180, 0, 0);
        this.vGait?.position.set(this.sway(), 0, 0);
    }

    onResetControls() {
        this.baseSway.set(0);
        this.basePitch.set(0);
        this.baseSpeed.set(1);
        this.leftOffset = 0;
        this.rightOffset = 0;
    }

    onTestSequence() {
        try {
            const commands = parseCommands(this.sequenceText());
            const sequence = new Sequence(this.sequenceName(), this.sequenceConditionText(), commands);
            this.sequenceError.set(undefined);
            this.currentState.set({
                rbs: this.baseSpeed(),
                lbs: this.baseSpeed(),
                pitch: this.basePitch(),
                sway: this.baseSway(),
            });
            this.currentSequence.set(sequence);
            sequence.start();
        } catch (e: any) {
            this.sequenceError.set(e.message);
        }
    }

    public afterSceneInit(SceneComponent: SceneComponent) {
        const { scene } = SceneComponent;
        const textureLoader = new TextureLoader();
        this.leftTex = textureLoader.load("textures/belt.png");
        this.rightTex = textureLoader.load("textures/belt.png");
        [this.leftTex, this.rightTex].forEach(tex => {
            tex.flipY = false;
            tex.wrapS = tex.wrapT = RepeatWrapping;
        });

        // use Page Visibility API to avoid large numbers
        this.timer.connect(document);

        const modelLoader = new GLTFLoader();
        modelLoader.load("grail.glb", gltf => {
            gltf.scene.traverse((child) => {
                if (child.name === "VGait_1") this.vGait = child;
                if (!isMesh(child)) return;
                // LeftBelt and RightBelt share one material in the GLB, so clone
                // before assigning maps — otherwise both belts get the same texture.
                if (child.name.includes("LeftBelt")) {
                    child.material = (child.material as any).clone();
                    (child.material as any).map = this.leftTex;
                }
                if (child.name.includes("RightBelt")) {
                    child.material = (child.material as any).clone();
                    (child.material as any).map = this.rightTex;
                }
            });
            scene.add(gltf.scene);
            gltf.scene.rotation.y = Math.PI;
            gltf.scene.position.y = 0.55;
        });
    }

}