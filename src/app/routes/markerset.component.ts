import { Component } from "@angular/core";
import { HumanComponent } from "./human.component";

@Component({
    host: { class: 'grow flex relative' },
    template: `
<human />
    `,
    imports: [HumanComponent],
})
export class MarkersetComponent { }