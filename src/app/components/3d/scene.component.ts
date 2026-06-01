import { AfterViewInit, Component, computed, ElementRef, HostListener, input, output, viewChild } from "@angular/core";
import { OrbitControls } from "three/examples/jsm/Addons.js";

import * as THREE from 'three';

export type SceneConfig = {
    cameraPosition: number[];
    backgroundColor: THREE.ColorRepresentation;
};

const DEFAULT_CONFIG: SceneConfig = {
    cameraPosition: [0, 1.5, 2.8],
    backgroundColor: 0xffffff,
};

@Component({
    selector: "scene",
    host: { class: "grow" },
    template: `
<div #viewer class="w-full h-full"></div>
`,
})
export class SceneComponent implements AfterViewInit {

    viewer = viewChild.required<ElementRef<HTMLDivElement>>("viewer");
    config = input<SceneConfig, Partial<SceneConfig>>(DEFAULT_CONFIG, { transform: (cfg: Partial<SceneConfig>) => ({ ...DEFAULT_CONFIG, ...cfg }) })
    AfterSceneInit = output<SceneComponent>();

    public scene!: THREE.Scene;
    public camera!: THREE.PerspectiveCamera;
    public renderer!: THREE.WebGLRenderer;
    public controls!: OrbitControls;
    public grid!: THREE.GridHelper;

    ngAfterViewInit(): void {
        this.initScene();
        this.AfterSceneInit.emit(this);
        requestAnimationFrame(() => this.animate());
    }

    private initScene(): void {
        const cfg = this.config();
        const el = this.viewer().nativeElement;
        const w = el.clientWidth;
        const h = el.clientHeight;

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(w * 2, h * 2);
        this.renderer.domElement.style.width = `${w}px`;
        this.renderer.domElement.style.height = `${h}px`;
        el.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(cfg.backgroundColor);
        this.camera = new THREE.PerspectiveCamera(42, w / h, 0.01, 100);

        const [x, y, z] = cfg.cameraPosition;
        this.camera.position.set(x, y, z);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0.9, 0);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.06;
        this.controls.minDistance = 0.4;
        this.controls.maxDistance = 10;
        this.controls.update();

        this.grid = new THREE.GridHelper(6, 24, 0xbbbbbb, 0xe0e0e0);
        this.scene.add(this.grid);

        const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
        keyLight.position.set(1.5, 3, 2);
        const fillLight = new THREE.DirectionalLight(0xddeeff, 0.6);
        fillLight.position.set(-2, 1, -1);
        const rimLight = new THREE.DirectionalLight(0xeef4ff, 0.5);
        rimLight.position.set(0, 2, -3);
        this.scene.add(new THREE.AmbientLight(0xffffff, 1.0), keyLight, fillLight, rimLight);
    }

    @HostListener('window:resize')
    onResize(): void {
        const el = this.viewer().nativeElement;
        const w = el.clientWidth;
        const h = el.clientHeight;

        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w * 2, h * 2);
        this.renderer.domElement.style.width = `${w}px`;
        this.renderer.domElement.style.height = `${h}px`;
    }

    private animate(): void {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}