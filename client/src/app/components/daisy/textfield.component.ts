import { Component, input, model } from "@angular/core";

@Component({
    selector: "textfield",
    template: `
        <fieldset class="fieldset">
            <legend class="fieldset-legend">{{ label() }}</legend>
            @if (area()) {
                <textarea #textarea class="textarea" [value]="value()" [placeholder]="placeholder()" (change)="value.set(textarea.value)"></textarea>
            } @else {
                <input #textinput type="text" class="input" [value]="value()" [placeholder]="placeholder()" (change)="value.set(textinput.value)"/>
            }
        </fieldset>
    `
})
export class TextFieldComponent {
    value = model<string>();
    label = input.required<string>();
    placeholder = input.required<string>();
    area = input(false);
}