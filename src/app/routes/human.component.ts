import {
    AfterViewInit,
    Component,
    effect,
    ElementRef,
    HostListener,
    inject,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ThemeService } from '../../theme.service';

type ViewMode = 'fresnel' | 'lit';

@Component({
    selector: 'human',
    host: { class: 'block relative grow min-h-0 overflow-hidden' },
    template: `
    <div #viewer class="w-full h-full"></div>

    <div #loading
         class="absolute inset-0 flex items-center justify-center bg-[rgba(0,5,8,0.85)] text-white text-[1.2rem] transition-opacity duration-700">
      <span>Loading model…</span>
    </div>

    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
      <div class="flex gap-2">
        <button [class]="rotateBtnClass()"    (click)="toggleRotate()">ROTATE: {{ isRotating ? 'ON' : 'OFF' }}</button>
      </div>
      @if (viewMode === 'fresnel') {
        <div class="flex items-center gap-2 text-[#aad4ff] font-mono text-[0.85rem]">
          <label>Skin opacity</label>
          <input type="range" min="0" max="100" value="60" (input)="onOpacityChange($event)" />
        </div>
      }
    </div>
  `,
})
export class HumanComponent implements AfterViewInit, OnDestroy {
    @ViewChild('viewer') private viewerRef!: ElementRef<HTMLDivElement>;
    @ViewChild('loading') private loadingRef!: ElementRef<HTMLDivElement>;

    viewMode: ViewMode = 'lit';
    isRotating = false;
    darkMode = inject(ThemeService).darkMode;

    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;
    private controls!: OrbitControls;
    private composer!: EffectComposer;
    private bloom!: UnrealBloomPass;
    private grid!: THREE.GridHelper;
    private animFrameId = 0;

    private skinMeshes: THREE.Mesh[] = [];
    private boneMeshes: THREE.Mesh[] = [];
    private skinFresnelMat!: THREE.ShaderMaterial;
    private boneFresnelMat!: THREE.ShaderMaterial;
    private litSkinMat!: THREE.MeshStandardMaterial;
    private litBoneMat!: THREE.MeshStandardMaterial;

    private readonly BASE_BTN = 'py-[0.4rem] px-4 border border-[#004466] cursor-pointer font-mono tracking-[0.05em]';
    private readonly ACTIVE_BTN = 'bg-[#004466] text-white';
    private readonly INACTIVE_BTN = 'bg-[#001122] text-[#aad4ff]';

    constructor() {
        effect(() => {
            const isDark = this.darkMode();
            this.applyMode(isDark ? 'fresnel' : 'lit');
        });
    }

    btnClass(mode: ViewMode): string {
        return `${this.BASE_BTN} ${this.viewMode === mode ? this.ACTIVE_BTN : this.INACTIVE_BTN}`;
    }

    rotateBtnClass(): string {
        return `${this.BASE_BTN} ${this.isRotating ? this.ACTIVE_BTN : this.INACTIVE_BTN}`;
    }

    ngAfterViewInit(): void {
        this.initScene();
        this.initMaterials();
        this.applyMode(this.viewMode);
        this.loadModel();
        this.animate();
    }

    ngOnDestroy(): void {
        cancelAnimationFrame(this.animFrameId);
        this.controls?.dispose();
        this.renderer?.dispose();
    }

    @HostListener('window:resize')
    onResize(): void {
        const el = this.viewerRef.nativeElement;
        const w = el.clientWidth;
        const h = el.clientHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w * 2, h * 2);
        this.renderer.domElement.style.width = `${w}px`;
        this.renderer.domElement.style.height = `${h}px`;
        this.composer.setSize(w * 2, h * 2);
    }

    applyMode(mode: ViewMode): void {
        if (!this.scene) return;   // not yet initialized

        this.viewMode = mode;
        const isFresnel = mode === 'fresnel';
        this.bloom.strength = isFresnel ? 0.8 : 0;

        this.scene.background = new THREE.Color(isFresnel ? 0x1d232a : 0xffffff);

        this.rebuildGrid(isFresnel ? 0x001a33 : 0xbbbbbb, isFresnel ? 0x000d1a : 0xe0e0e0);

        for (const mesh of this.skinMeshes) {
            mesh.material = isFresnel ? this.skinFresnelMat : this.litSkinMat;
            mesh.renderOrder = isFresnel ? 1 : 0;
        }
        for (const mesh of this.boneMeshes) {
            mesh.material = isFresnel ? this.boneFresnelMat : this.litBoneMat;
        }
    }

    private rebuildGrid(centerColor: number, gridColor: number): void {
        const y = this.grid.position.y;
        this.scene.remove(this.grid);
        this.grid.geometry.dispose();
        (this.grid.material as THREE.Material).dispose();
        this.grid = new THREE.GridHelper(6, 24, centerColor, gridColor);
        this.grid.position.y = y;
        this.scene.add(this.grid);
    }

    toggleRotate(): void {
        this.isRotating = !this.isRotating;
        this.controls.autoRotate = this.isRotating;
        this.controls.autoRotateSpeed = 1.2;
    }

    onOpacityChange(event: Event): void {
        const value = +(event.target as HTMLInputElement).value;
        this.skinFresnelMat.uniforms['rimIntensity'].value = (value / 100) * 2.0;
    }

    private initScene(): void {
        const el = this.viewerRef.nativeElement;
        const w = el.clientWidth;
        const h = el.clientHeight;

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(w * 2, h * 2);
        this.renderer.domElement.style.width = `${w}px`;
        this.renderer.domElement.style.height = `${h}px`;
        el.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1d232a);

        this.camera = new THREE.PerspectiveCamera(42, w / h, 0.01, 100);
        this.camera.position.set(0, 1.5, 2.8);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0.9, 0);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.06;
        this.controls.minDistance = 0.4;
        this.controls.maxDistance = 8;
        this.controls.update();

        this.grid = new THREE.GridHelper(6, 24, 0x001a33, 0x000d1a);
        this.scene.add(this.grid);

        const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
        keyLight.position.set(1.5, 3, 2);
        const fillLight = new THREE.DirectionalLight(0xddeeff, 0.6);
        fillLight.position.set(-2, 1, -1);
        const rimLight = new THREE.DirectionalLight(0xeef4ff, 0.5);
        rimLight.position.set(0, 2, -3);
        this.scene.add(new THREE.AmbientLight(0xffffff, 1.0), keyLight, fillLight, rimLight);

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        this.bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.2, 0.6, 0.1);
        this.composer.addPass(this.bloom);
    }

    private initMaterials(): void {
        const vertexShader = `
      #include <common>
      #include <skinning_pars_vertex>
      varying vec3 vNormal;
      varying vec3 vViewPos;
      void main() {
        #include <beginnormal_vertex>
        #include <skinbase_vertex>
        #include <skinnormal_vertex>
        #include <begin_vertex>
        #include <skinning_vertex>
        vec4 mvPos = modelViewMatrix * vec4(transformed, 1.0);
        vNormal  = normalize(normalMatrix * objectNormal);
        vViewPos = mvPos.xyz;
        gl_Position = projectionMatrix * mvPos;
      }
    `;
        const fragmentShader = `
      uniform vec3  glowColor;
      uniform float rimPower;
      uniform float rimIntensity;
      varying vec3 vNormal;
      varying vec3 vViewPos;
      void main() {
        float rim   = pow(1.0 - abs(dot(normalize(vNormal), normalize(-vViewPos))), rimPower);
        float alpha = clamp(rim * rimIntensity, 0.0, 1.0);
        gl_FragColor = vec4(glowColor * rimIntensity * rim, alpha);
      }
    `;

        this.skinFresnelMat = new THREE.ShaderMaterial({
            uniforms: {
                glowColor: { value: new THREE.Color(0x00d4ff) },
                rimPower: { value: 3.0 },
                rimIntensity: { value: 1.2 },
            },
            vertexShader,
            fragmentShader,
            transparent: true,
            side: THREE.FrontSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        this.boneFresnelMat = new THREE.ShaderMaterial({
            uniforms: {
                glowColor: { value: new THREE.Color(0xffffff) },
                rimPower: { value: 2.0 },
                rimIntensity: { value: 0.8 },
            },
            vertexShader,
            fragmentShader,
            transparent: true,
            side: THREE.FrontSide,
            depthWrite: true,
            blending: THREE.AdditiveBlending,
        });

        this.litSkinMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55, metalness: 0.0 });
        this.litBoneMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55, metalness: 0.0 });
    }

    private loadModel(): void {
        const loader = new GLTFLoader();
        loader.load(
            'SkinAndSkeleton.glb',
            (gltf) => {
                const model = gltf.scene;
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                model.position.sub(center);
                model.position.y += size.y / 2;
                this.grid.position.y = -(size.y / 2);

                model.traverse((child) => {
                    if (!(child instanceof THREE.Mesh)) return;
                    child.geometry.computeVertexNormals();
                    if (child.name.startsWith('s_')) {
                        this.boneMeshes.push(child);
                        child.material = this.boneFresnelMat;
                        child.renderOrder = 0;
                    } else {
                        this.skinMeshes.push(child);
                        child.material = this.skinFresnelMat;
                        child.renderOrder = 1;
                    }
                });

                this.scene.add(model);
                this.applyMode(this.viewMode);
                const el = this.loadingRef.nativeElement;
                el.classList.add('opacity-0', 'pointer-events-none');
                setTimeout(() => el.remove(), 700);
            },
            undefined,
            (err) => {
                console.error('Could not load SkinAndSkeleton.glb:', err);
                this.loadingRef.nativeElement.querySelector('span')!.textContent = 'ERROR — see console';
            },
        );
    }

    private animate(): void {
        this.animFrameId = requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.composer.render();
    }
}
