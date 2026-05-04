import { Component, computed, input, output } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
import { LeafInfo, LeafStep } from '../models/instruction';

@Component({
    selector: 'app-leaf-item',
    imports: [MarkdownComponent],
    template: `
        <label class="flex items-center gap-3 px-4 py-2 hover:bg-base-200 cursor-pointer group">
            <input type="checkbox" class="checkbox checkbox-primary checkbox-sm shrink-0"
                [checked]="checked()"
                (change)="toggle.emit()">
            <markdown class="text-sm flex-1 leading-snug [&>p]:m-0" [data]="leaf().description" />
            @if (leaf().info) {
                <div class="tooltip tooltip-left" [attr.data-tip]="infoPreview()">
                    <button
                        class="btn btn-xs btn-circle font-serif italic group-hover:opacity-50 hover:opacity-100! shrink-0"
                        (click)="$event.preventDefault(); openInfo.emit(leaf().info!)">
                        i
                    </button>
                </div>
            }
        </label>
    `,
})
export class LeafItemComponent {
    leaf = input.required<LeafStep>();
    checked = input<boolean>(false);
    toggle = output<void>();
    openInfo = output<LeafInfo>();

    infoPreview = computed(() => {
        const raw = this.leaf().info?.content ?? '';
        const text = raw
            .replace(/!\[.*?\]\(.*?\)/g, '')
            .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
            .replace(/```[\s\S]*?```/g, '')
            .replace(/[#*_`>~|-]+/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        return text.length > 80 ? text.slice(0, 80) + '…' : text;
    });
}
