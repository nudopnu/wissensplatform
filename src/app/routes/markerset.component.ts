import { Component, signal } from "@angular/core";
import { HumanComponent } from "../components/human.component";
import { CameraPosition } from "../models/cameraposition";

@Component({
    host: { class: 'grow flex relative' },
    template: `
<human [cameraPosition]="cameraPos()" />
<aside class="absolute right-1 p-4">
    <button class="btn" (click)="onclick()">Camera</button>
</aside>
    `,
    imports: [HumanComponent],
})
export class MarkersetComponent {
    cameraPos = signal<CameraPosition>({ azimuth: 0, polar: Math.PI / 2, radius: 4 });

    positions: CameraPosition[] = [
        { "azimuth": -0.5289416202472575, "polar": 1.4184237546188165, "radius": 1.5, "offset": { "x": -0.06172977228344065, "y": 1.2305198961279227, "z": 0.009944486146567942 } },
        { "azimuth": 2.5629475127752297, "polar": 1.3476475749365826, "radius": 1.5, "offset": { "x": -0.061697924856772245, "y": 1.2309285481188117, "z": 0.0098904137820465 } },
        {
            "azimuth": 0.9597557254947916,
            "polar": 1.5319834614427459,
            "radius": 1.5248239523478733,
            "offset": {
                "x": 0.03387284885010411,
                "y": 0.4788132833680505,
                "z": 0.20152981494396907
            }
        },

        {
            "azimuth": -0.7552974068220775,
            "polar": 1.6121261311771762,
            "radius": 1.524823952347877,
            "offset": {
                "x": -0.013947742312915158,
                "y": 0.48105300149520264,
                "z": 0.15656430353892947
            }
        },
        {
            "azimuth": 2.465870589917422,
            "polar": 1.6920037574318438,
            "radius": 1.5248239523478417,
            "offset": {
                "x": 0.02312513350824537,
                "y": 0.33099424542736955,
                "z": 0.12710848658732632
            }
        },
    ];
    idx = 0;

    onclick() {
        this.cameraPos.set(this.positions[this.idx++]);
        this.idx %= this.positions.length;
    }
}