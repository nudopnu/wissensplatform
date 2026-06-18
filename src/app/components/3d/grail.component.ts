import { Component, computed, inject, signal } from "@angular/core";
import { Object3D, RepeatWrapping, Texture, TextureEventMap, TextureLoader, Timer } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { parseCommands, Sequence } from "../../models/sequence";
import { TreadmillState } from "../../models/treadmill-state";
import { DrawerComponent } from "../daisy/drawer.component";
import { SliderComponent } from "../daisy/slider.component";
import { TextFieldComponent } from "../daisy/textfield.component";
import { SceneComponent } from "./scene.component";
import { isMesh } from "./three.utils";
import { RemoteService } from "../../services/remote.service";


@Component({
    selector: "grail",
    imports: [SceneComponent, SliderComponent, TextFieldComponent, DrawerComponent],
    host: { class: 'grow relative h-full flex flex-col' },
    template: `
    <scene (afterSceneInit)="afterSceneInit($event)" (onAnimate)="onAnimate($event)"></scene>
    <aside class="absolute left-0 top-0 w-72 p-5 bottom-0 flex flex-col gap-4 pointer-events-none whitespace-pre">
        <code>Pitch: {{ pitch().toFixed(4).padStart(8) }}</code>
        <code>Sway: {{ sway().toFixed(4).padStart(9) }}</code>
        <code>LBS: {{ lbs().toFixed(4).padStart(10) }}</code>
        <code>RBS: {{ rbs().toFixed(4).padStart(10) }}</code>
    </aside>
    <drawer>
        <div class="divider">Basiszustand</div>

        <slider label="Pitch" [min]="-10" [max]="10" [(value)]="targetBasePitch"></slider>
        <slider label="Sway" [min]="-0.05" [max]="0.05" [step]="0.01" [(value)]="targetBaseSway"></slider>
        <slider label="Speed" [min]="-3" [max]="7" [step]="0.1" [(value)]="targetBaseSpeed"></slider>
        <button class="btn" (click)="onResetControls()">Zurücksetzen</button>

        <div class="divider">Neue Sequenz</div>
        
        <textfield label="Name" [(value)]="sequenceName" placeholder="Beispiel: Testsequenz"></textfield>
        <textfield label="Sequenz" [(value)]="sequenceText" [area]="true" placeholder="Beispiel:\nlbs -3\nrbs -3\nwait 50"></textfield>
        @if (sequenceError()) {
            <p class="text-error text-sm">{{ sequenceError() }}</p>
        }

        <button class="btn btn-primary" (click)="onTestSequence()">Sequenz testen</button>
        
        <div class="divider">Verbindung zu D-FLow</div>
        
        <button class="btn btn-accent" (click)="onStartDFLow()">DFlow starten</button>
        <button class="btn btn-primary" (click)="onSaveSequence()">Sequenz speichern</button>
        <button class="btn btn-primary" (click)="onTestSequenceLive()">Sequenz live testen</button>

    </drawer>
`,
})
export class GrailComponent {

    remote = inject(RemoteService);

    // Target base params from sliders
    targetBasePitch = signal(0);
    targetBaseSway = signal(0);
    targetBaseSpeed = signal(1);
    sequenceName = signal("");
    sequenceConditionText = signal("");
    sequenceText = signal("");
    sequenceError = signal<string | undefined>(undefined);
    currentSequence = signal<Sequence | undefined>(undefined);

    // state controlled by sliders
    targetBaseState = computed<TreadmillState>(() => ({
        lbs: this.targetBaseSpeed(),
        rbs: this.targetBaseSpeed(),
        pitch: this.targetBasePitch(),
        sway: this.targetBaseSway(),
    }));

    // state controlled by sequence
    targetSequenceState = signal<TreadmillState>({
        lbs: this.targetBaseSpeed(),
        rbs: this.targetBaseSpeed(),
        pitch: this.targetBasePitch(),
        sway: this.targetBaseSway(),
    });

    // resulting target state (either base or sequence)
    targetState = computed(() => this.currentSequence() ? this.targetSequenceState() : this.targetBaseState());

    /* SIMULATION */

    currentState = signal<TreadmillState>(this.targetState());

    // change rate
    currentChangeRate = computed<TreadmillState>(() => ({
        rbs: Math.sign(this.targetState().rbs - this.currentState().rbs) * this.beltAccelleration,
        lbs: Math.sign(this.targetState().lbs - this.currentState().lbs) * this.beltAccelleration,
        pitch: Math.sign(this.targetState().pitch - this.currentState().pitch) * this.pitchChangeRate,
        sway: Math.sign(this.targetState().sway - this.currentState().sway) * this.swayChangeRate,
    }));

    // simulation params
    beltAccelleration = 15;
    beltSpeedRange = [-3, 15];
    pitchChangeRate = 18;
    swayChangeRate = 0.11;

    // Actual params
    pitch = computed(() => this.currentState().pitch);
    sway = computed(() => this.currentState().sway);
    lbs = computed(() => this.currentState().lbs);
    rbs = computed(() => this.currentState().rbs);

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
            this.targetSequenceState.update(sequence.update.bind(sequence));
            if (sequence.hasEnded) {
                this.currentSequence.set(undefined);
            }
        }

        const delta = this.timer.getDelta();

        // simulation step
        const currentChangeRate = this.currentChangeRate();
        this.currentState.update(old => {
            let lbs = old.lbs + currentChangeRate.lbs * delta;
            let rbs = old.rbs + currentChangeRate.rbs * delta;
            let pitch = old.pitch + currentChangeRate.pitch * delta;
            let sway = old.sway + currentChangeRate.sway * delta;

            // clamp values to prevent overshooting
            lbs = Math.sign(currentChangeRate.lbs) < 0 ? Math.max(lbs, this.targetState().lbs) : Math.min(lbs, this.targetState().lbs);
            rbs = Math.sign(currentChangeRate.rbs) < 0 ? Math.max(rbs, this.targetState().rbs) : Math.min(rbs, this.targetState().rbs);
            pitch = Math.sign(currentChangeRate.pitch) < 0 ? Math.max(pitch, this.targetState().pitch) : Math.min(pitch, this.targetState().pitch);
            sway = Math.sign(currentChangeRate.sway) < 0 ? Math.max(sway, this.targetState().sway) : Math.min(sway, this.targetState().sway);
            return { lbs, rbs, pitch, sway };
        });

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
        this.targetBaseSway.set(0);
        this.targetBasePitch.set(0);
        this.targetBaseSpeed.set(1);
        this.leftOffset = 0;
        this.rightOffset = 0;
    }

    onTestSequence() {
        try {
            const commands = parseCommands(this.sequenceText());
            const sequence = new Sequence(this.sequenceName(), this.sequenceConditionText(), commands);
            this.sequenceError.set(undefined);
            this.currentSequence.set(sequence);
            sequence.start();
        } catch (e: any) {
            this.sequenceError.set(e.message);
        }
    }

    async onSaveSequence() {
        const result = await this.remote.saveSequence(this.sequenceName(), this.sequenceText());
        console.log(result);
    }

    async onTestSequenceLive() {
        const result = await this.remote.runSequence(this.sequenceName())
        console.log(result);
    }

    async onStartDFLow() {
        await this.remote.startDFlow();
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