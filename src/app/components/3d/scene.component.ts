import { AfterViewInit, Component, computed, effect, ElementRef, HostListener, inject, input, output, viewChild } from "@angular/core";
import { OrbitControls } from "three/examples/jsm/Addons.js";

import * as THREE from 'three';
import { ThemeService } from "../../../theme.service";

export type SceneConfig = {
    cameraPosition: number[];
    themes: {
        dark: ThemeConfig;
        light: ThemeConfig;
    }
};

export type ThemeConfig = {
    backgroundColor: THREE.ColorRepresentation;
}

export type ViewMode = 'dark' | 'light';

const DEFAULT_CONFIG: SceneConfig = {
    cameraPosition: [0, 1.5, 2.8],
    themes: {
        light: {
            backgroundColor: 0xffffff,
        },
        dark: {
            backgroundColor: 0x1d232a,
        }
    }
};

@Component({
    selector: "scene",
    host: { class: "grow" },
    template: `
<div #viewer class="w-full h-full"></div>
`,
})
export class SceneComponent implements AfterViewInit {

    isDarkMode = inject(ThemeService).isDarkMode;
    theme = computed(() => this.isDarkMode() ? this.config().themes.dark : this.config().themes.light)
    viewer = viewChild.required<ElementRef<HTMLDivElement>>("viewer");
    config = input<SceneConfig, Partial<SceneConfig>>(DEFAULT_CONFIG, { transform: (cfg: Partial<SceneConfig>) => ({ ...DEFAULT_CONFIG, ...cfg }) })
    afterSceneInit = output<SceneComponent>();

    public scene!: THREE.Scene;
    public camera!: THREE.PerspectiveCamera;
    public renderer!: THREE.WebGLRenderer;
    public controls!: OrbitControls;
    public grid!: THREE.GridHelper;

    constructor() {
        effect(() => {
            this.applyTheme(this.theme());
        });
    }

    ngAfterViewInit(): void {
        this.initScene();
        this.applyTheme(this.theme());
        this.afterSceneInit.emit(this);
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

    private applyTheme(theme: ThemeConfig) {
        if (!this.scene) return; // not yet initialized

        this.scene.background = new THREE.Color(theme.backgroundColor);
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