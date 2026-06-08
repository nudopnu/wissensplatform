import { AfterViewInit, Component, computed, effect, ElementRef, HostListener, inject, output, viewChild } from "@angular/core";
import { OrbitControls } from "three/examples/jsm/Addons.js";

import * as THREE from 'three';
import { ThemeConfig } from "../../models/scene-config.model";
import { ThemeService } from "../../services/theme.service";
import { UserConfigService } from "../../services/user-config.service";

@Component({
    selector: "scene",
    host: { class: "grow" },
    template: `
<div #viewer class="w-full h-full"></div>
`,
})
export class SceneComponent implements AfterViewInit {

    isDarkMode = inject(ThemeService).isDarkMode;
    config = inject(UserConfigService).config;
    resoultionFactor = computed(() => this.config().antialiasing ? 2 : 1);
    theme = computed(() => this.isDarkMode() ? this.config().themes.dark : this.config().themes.light);
    viewer = viewChild.required<ElementRef<HTMLDivElement>>("viewer");
    afterSceneInit = output<SceneComponent>();
    onAnimate = output<number>();

    public scene!: THREE.Scene;
    public camera!: THREE.PerspectiveCamera;
    public renderer!: THREE.WebGLRenderer;
    public controls!: OrbitControls;
    public grid!: THREE.GridHelper;

    constructor() {
        effect(() => {
            this.applyTheme(this.theme());
        });
        effect(() => {
            const _ = this.resoultionFactor();
            this.onResize();
        });
    }

    ngAfterViewInit(): void {
        this.initScene();
        this.applyTheme(this.theme());
        this.afterSceneInit.emit(this);
        requestAnimationFrame((timestamp) => this.animate(timestamp));
    }

    private initScene(): void {
        const cfg = this.config();
        const el = this.viewer().nativeElement;
        const w = el.clientWidth;
        const h = el.clientHeight;
        const resolutionFactor = this.resoultionFactor();

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(w * resolutionFactor, h * resolutionFactor);
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
        this.controls.minDistance = cfg.minDistance;
        this.controls.maxDistance = cfg.maxDistance;
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
        if (!this.scene) return;

        const el = this.viewer().nativeElement;
        const w = el.clientWidth;
        const h = el.clientHeight;
        const resolutionFactor = this.resoultionFactor();

        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w * resolutionFactor, h * resolutionFactor);
        this.renderer.domElement.style.width = `${w}px`;
        this.renderer.domElement.style.height = `${h}px`;
    }

    private animate(timestamp: number): void {
        requestAnimationFrame((timestamp) => this.animate(timestamp));
        this.onAnimate.emit(timestamp);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}