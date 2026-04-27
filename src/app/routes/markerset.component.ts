import { Component, signal } from "@angular/core";
import { HumanComponent } from "../components/human.component";
import { CameraPosition } from "../models/cameraposition";

@Component({
    host: { class: 'grow flex relative' },
    template: `
<human [cameraPosition]="cameraPos()" />
<aside class="absolute right-1">
    <button class="btn" (click)="onclick()">asdas</button>
</aside>
    `,
    imports: [HumanComponent],
})
export class MarkersetComponent {
    cameraPos = signal<CameraPosition>({ azimuth: 0, polar: Math.PI / 2, radius: 100 });

    positions: CameraPosition[] = [
        { azimuth: Math.PI / 2, polar: Math.PI / 2, radius: 100 },
        { azimuth: 0, polar: Math.PI / 2, radius: 100 },
    ];
    idx = 0;

    onclick() {
        this.cameraPos.set(this.positions[this.idx++]);
        this.idx %= this.positions.length;
    }
}