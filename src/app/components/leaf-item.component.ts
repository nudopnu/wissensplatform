import { Component, input, output } from '@angular/core';
import { LeafStep } from '../models/instruction';

@Component({
    selector: 'app-leaf-item',
    template: `
        <label class="flex items-center gap-3 px-4 py-2 hover:bg-base-200 cursor-pointer group">
            <input type="checkbox" class="checkbox checkbox-primary checkbox-sm shrink-0"
                [checked]="checked()"
                (change)="toggle.emit()">
            <span class="text-sm flex-1 leading-snug">{{ leaf().title }}</span>
            @if (leaf().info) {
                <button
                    class="btn btn-xs btn-circle font-serif italic group-hover:opacity-50 hover:opacity-100! shrink-0"
                    (click)="$event.preventDefault(); openInfo.emit(leaf().info!)">
                    i
                </button>
            }
        </label>
    `,
})
export class LeafItemComponent {
    leaf = input.required<LeafStep>();
    checked = input<boolean>(false);
    toggle = output<void>();
    openInfo = output<string>();
}
