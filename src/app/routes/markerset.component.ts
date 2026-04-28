import { Component, computed, signal } from "@angular/core";
import { HumanComponent } from "../components/human.component";
import { CameraPosition } from "../models/cameraposition";
import { pluginGaitMarkers } from "../models/plugin-gait";

export type Section = {
    name: string;
    title: string;
    cameraPosition: CameraPosition;
}

@Component({
    host: { class: 'grow flex relative' },
    template: `
<human [cameraPosition]="cameraPos()" />

<!-- toggle tab -->
<button
    class="absolute top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-6 h-16 bg-base-200/80 backdrop-blur-sm rounded-l-xl transition-all duration-300"
    [style.right]="drawerOpen() ? '18rem' : '0'"
    (click)="drawerOpen.set(!drawerOpen())"
>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
        class="size-4 transition-transform duration-300" [class.rotate-180]="drawerOpen()">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
</button>

<!-- drawer -->
<aside
    class="absolute right-0 top-0 bottom-0 w-72 flex flex-col gap-4 bg-base-200/80 backdrop-blur-sm p-5 shadow-xl transition-transform duration-300"
    [class.translate-x-full]="!drawerOpen()"
>
    <h2 class="text-xl font-bold capitalize tracking-wide">{{ currentSection().title }}</h2>
    <section class="flex flex-col gap-2 overflow-y-auto flex-1 pr-1">
        @for (marker of sectionMarkers(); track $index) {
            <article class="bg-base-100/70 rounded-xl px-4 py-3 flex flex-col gap-0.5">
                <h3 class="text-sm font-bold text-primary">{{ marker.abbreviation }}</h3>
                <small class="text-xs font-medium text-base-content/70">{{ marker.name }}</small>
                <p class="text-xs text-base-content/50 leading-snug">{{ marker.description }}</p>
            </article>
        }
    </section>
    <section class="flex w-full justify-stretch gap-2">
        <button class="btn" (click)="onClickBack()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
        </button>
        <button class="btn btn-primary capitalize grow" (click)="onclick()">
            {{ nextSection().title }}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
        </button>
    </section>
</aside>
    `,
    imports: [HumanComponent],
})
export class MarkersetComponent {
    positions: CameraPosition[] = [
        { azimuth: -0.53, polar: 1.4184237546188165, radius: 1.5, offset: { x: -0.06172977228344065, y: 1.2305198961279227, z: 0.009944486146567942 } },
        { azimuth: 2.56, polar: 1.3476475749365826, radius: 1.5, offset: { x: -0.061697924856772245, y: 1.2309285481188117, z: 0.0098904137820465 } },
        { azimuth: 0.96, polar: 1.5319834614427459, radius: 1.5248239523478733, offset: { x: 0.03387284885010411, y: 0.4788132833680505, z: 0.20152981494396907 } },
        { azimuth: -0.75, polar: 1.6121261311771762, radius: 1.524823952347877, offset: { x: -0.013947742312915158, y: 0.48105300149520264, z: 0.15656430353892947 } },
        { azimuth: 2.46, polar: 1.6920037574318438, radius: 1.5248239523478417, offset: { x: 0.02312513350824537, y: 0.33099424542736955, z: 0.12710848658732632 } },
    ];
    sections: Section[] = [
        { title: "Kopf", name: "head", cameraPosition: { azimuth: 1.4, polar: 1.4, radius: 0.8, offset: { x: -0.027386657117932235, y: 1.6024308027941734, z: -0.08018106127244119 } } },
        { title: "Brust", name: "chest", cameraPosition: { azimuth: -0.53, polar: 1.4184237546188165, radius: 1.5, offset: { x: 0, y: 1.25, z: 0 } } },
        { title: "Rücken", name: "back", cameraPosition: { azimuth: 2.56, polar: 1.3476475749365826, radius: 1.5, offset: { x: 0, y: 1.25, z: 0 } } },
        { title: "Rechter Arm", name: "arm right", cameraPosition: { azimuth: 1.760193049901144, polar: 0.8083896042338266, radius: 1.826855211700685, offset: { x: 0.10393556628959008, y: 0.9138209871554698, z: 0.008240661971648822 } } },
        { title: "Linker Arm", name: "arm left", cameraPosition: { azimuth: -1.4271163962527094, polar: 1.1934803823958935, radius: 1.6553972277481126, offset: { x: 0.10393556628959008, y: 0.9138209871554698, z: 0.008240661971648822 } } },
        { title: "Hüfte hinten", name: "hip back", cameraPosition: { azimuth: -2.7193942704626637, polar: 1.3789694209973087, radius: 1.5076839007361214, offset: { x: -0.07839693626873526, y: 1.2394212958331268, z: 0.022619462501132597 } } },
        { title: "Hüfte vorne", name: "hip front", cameraPosition: this.positions[0] },
        { title: "Rechtes Bein", name: "leg right", cameraPosition: { azimuth: -0.6729550034916044, polar: 1.6591092138640886, radius: 1.5921335310892282, offset: { x: -0.03593006785198116, y: 0.4334644325268781, z: -0.03107727413698646 } } },
        { title: "Linkes Bein", name: "leg left", cameraPosition: this.positions[2] },
        { title: "Füße hinten", name: "foot back", cameraPosition: this.positions[4] },
    ];
    drawerOpen = signal(true);
    cameraPos = signal<CameraPosition>({ azimuth: 0, polar: Math.PI / 2, radius: 4 });
    currentSection = signal<Section>(this.sections[0]);
    previousSection = computed(() => this.sections[(this.sections.indexOf(this.currentSection()) + this.sections.length - 1) % this.sections.length]);
    nextSection = computed(() => this.sections[(this.sections.indexOf(this.currentSection()) + 1) % this.sections.length]);
    sectionMarkers = computed(() => this.markers.filter(marker => marker.section == this.currentSection().name));
    markers = pluginGaitMarkers;

    onclick() {
        this.currentSection.set(this.nextSection());
        const cameraPosition = this.currentSection().cameraPosition;
        this.cameraPos.set(cameraPosition);
    }

    onClickBack() {
        this.currentSection.set(this.previousSection());
        const cameraPosition = this.currentSection().cameraPosition;
        this.cameraPos.set(cameraPosition);
    }

}