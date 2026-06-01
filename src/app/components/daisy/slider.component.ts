import { Component, input, model } from "@angular/core";

@Component({
    selector: "slider",
    template: `
        <fieldset class="fieldset">
            <legend class="fieldset-legend">{{ label() }}</legend>
            <div class="flex items-center gap-4">
                <input #range type="range" [min]="min()" [max]="max()" [step]="step()" [value]="value()" class="range range-primary" (input)="value.set(+range.value)" />
                <input #input type="number" inputmode="numeric" pattern="[0-9]*" name="pitch" [min]="min()" [max]="max()" [step]="step()" [value]="value()" class="input flex-[0_1_120px]" (input)="value.set(+input.value)">
            </div>
        </fieldset>
    `
})
export class SliderComponent {
    label = input.required<string>();
    min = input(0);
    max = input(100);
    step = input(1);
    value = model(50);
}