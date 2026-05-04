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
<human [cameraPosition]="cameraPos()" [highlightedMarker]="selectedMarker()" />

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
    <section class="flex flex-col gap-2 p-1 overflow-y-auto flex-1 pr-1">
        @for (marker of sectionMarkers(); track $index) {
            <article
                class="rounded-xl px-4 py-3 flex flex-col gap-0.5 cursor-pointer transition-colors"
                [class]="selectedMarker() === marker.abbreviation
                    ? 'bg-primary/20 ring-2 ring-primary'
                    : 'bg-base-100/70 hover:bg-base-100'"
                (click)="selectedMarker.set(selectedMarker() === marker.abbreviation ? null : marker.abbreviation)"
            >
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
    sections: Section[] = [
        { title: "Kopf", name: "head", cameraPosition: { azimuth: 1.4, polar: 1.4, radius: 0.8, offset: { x: -0.03, y: 1.60, z: -0.08 } } },
        { title: "Brust", name: "chest", cameraPosition: { azimuth: -0.53, polar: 1.42, radius: 1.5, offset: { x: 0.07, y: 1.22, z: 0.04 } } },
        { title: "Rücken", name: "back", cameraPosition: { azimuth: -3.10, polar: 1.4, radius: 1.50, offset: { x: -0.12, y: 1.24, z: 0.01 } } },
        { title: "Rechter Arm", name: "arm right", cameraPosition: { azimuth: -1.43, polar: 1.19, radius: 1.66, offset: { x: 0.1, y: 0.91, z: 0.01 } } },
        { title: "Linker Arm", name: "arm left", cameraPosition: { azimuth: 1.76, polar: 0.80, radius: 1.83, offset: { x: 0.1, y: 0.91, z: 0.01 } } },
        { title: "Hüfte hinten", name: "hip back", cameraPosition: { azimuth: -2.72, polar: 1.38, radius: 1.51, offset: { x: -0.0, y: 1.2, z: 0.02 } } },
        { title: "Hüfte vorne", name: "hip front", cameraPosition: { azimuth: -0.40, polar: 1.2, radius: 1.5, offset: { x: 0.08, y: 1.22, z: 0.1 } } },
        { title: "Rechtes Bein", name: "leg right", cameraPosition: { azimuth: -0.67, polar: 1.6, radius: 1.59, offset: { x: -0.0, y: 0.43, z: -0.03 } } },
        { title: "Linkes Bein", name: "leg left", cameraPosition: { azimuth: 0.93, polar: 1.53, radius: 1.53, offset: { x: 0.21, y: 0.45, z: -0.03 } } },
        { title: "Füße hinten", name: "foot back", cameraPosition: { azimuth: 2.46, polar: 1.69, radius: 1.52, offset: { x: 0.02, y: 0.33, z: 0.13 } } },
    ];
    drawerOpen = signal(true);
    selectedMarker = signal<string | null>(null);
    cameraPos = signal<CameraPosition>({ azimuth: 0, polar: Math.PI / 2, radius: 4 });
    currentSection = signal<Section>(this.sections[0]);
    previousSection = computed(() => this.sections[(this.sections.indexOf(this.currentSection()) + this.sections.length - 1) % this.sections.length]);
    nextSection = computed(() => this.sections[(this.sections.indexOf(this.currentSection()) + 1) % this.sections.length]);
    sectionMarkers = computed(() => this.markers.filter(marker => marker.section == this.currentSection().name));
    markers = pluginGaitMarkers;

    onclick() {
        this.currentSection.set(this.nextSection());
        this.cameraPos.set(this.currentSection().cameraPosition);
        this.selectedMarker.set(null);
    }

    onClickBack() {
        this.currentSection.set(this.previousSection());
        this.cameraPos.set(this.currentSection().cameraPosition);
        this.selectedMarker.set(null);
    }

}