import { AfterViewInit, Component, ElementRef, ViewChild, computed, input, output, signal } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
import { MacroStep } from '../models/instruction';
import { LeafItemComponent } from './leaf-item.component';

@Component({
    selector: 'app-macro-step',
    imports: [LeafItemComponent, MarkdownComponent],
    template: `
        <div class="collapse collapse-arrow join-item border border-base-300 bg-base-100">
            <input type="radio" name="steps-accordion" [checked]="active()" />
            <div class="collapse-title py-3 min-h-0">
                <div class="flex items-center gap-3 pr-6">
                    <span class="badge badge-primary badge-sm font-mono shrink-0">{{ num() }}</span>
                    <span class="font-semibold text-sm flex-1">{{ step().title }}</span>
                    <span class="text-xs font-mono opacity-40 shrink-0">{{ stepChecked() }}/{{ stepTotal() }}</span>
                </div>
            </div>
            <div class="collapse-content px-0 pb-2">
                @for (mid of step().mids; track mid.id) {
                    @if (mid.title) {
                        <details class="group/mid" open>
                            <summary class="px-4 py-2 text-xs font-semibold uppercase tracking-wider opacity-50 cursor-pointer hover:opacity-80 list-none flex items-center gap-2">
                                <svg class="w-3 h-3 -rotate-90 transition-transform group-open/mid:rotate-0 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
                                </svg>
                                {{ mid.title }}
                            </summary>
                            <div>
                                @for (leaf of mid.leaves; track leaf.id) {
                                    <app-leaf-item [leaf]="leaf" [checked]="checkedIds().has(leaf.id)"
                                        (toggle)="leafToggled.emit(leaf.id)" (openInfo)="openInfo($event)" />
                                }
                            </div>
                        </details>
                    } @else {
                        @for (leaf of mid.leaves; track leaf.id) {
                            <app-leaf-item [leaf]="leaf" [checked]="checkedIds().has(leaf.id)"
                                (toggle)="leafToggled.emit(leaf.id)" (openInfo)="openInfo($event)" />
                        }
                    }
                }
            </div>
        </div>

        <dialog #infoDialog class="modal">
            <div class="modal-box max-w-lg">
                <div class="prose prose-sm max-w-none">
                    <markdown [data]="selectedInfo()" />
                </div>
                <div class="modal-action mt-4">
                    <form method="dialog">
                        <button class="btn btn-sm btn-ghost">Close</button>
                    </form>
                </div>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    `,
})
export class MacroStepComponent implements AfterViewInit {
    step = input.required<MacroStep>();
    num = input.required<number>();
    active = input<boolean>(false);
    checkedIds = input<ReadonlySet<string>>(new Set());
    leafToggled = output<string>();

    @ViewChild('infoDialog') private dialogRef!: ElementRef<HTMLDialogElement>;

    selectedInfo = signal<string | undefined>(undefined);
    stepTotal = computed(() => this.step().mids.flatMap(m => m.leaves).length);
    stepChecked = computed(() => this.step().mids.flatMap(m => m.leaves).filter(l => this.checkedIds().has(l.id)).length);

    ngAfterViewInit(): void {
        this.dialogRef.nativeElement.addEventListener('close', () => this.selectedInfo.set(undefined));
    }

    openInfo(info: string): void {
        this.selectedInfo.set(info);
        this.dialogRef.nativeElement.showModal();
    }
}
