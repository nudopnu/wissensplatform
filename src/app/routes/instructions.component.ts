import { DOCUMENT } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { MacroStepComponent } from '../components/macro-step.component';
import { MacroStep } from '../models/instruction';

@Component({
    host: { class: 'grow container mx-auto flex flex-col overflow-hidden' },
    imports: [MacroStepComponent],
    template: `
        <header class="p-3 flex items-center gap-4">
            <h1 class="font-mono font-semibold text-sm tracking-wide uppercase whitespace-nowrap">
                Plugin Gait · Protokoll
            </h1>
            <progress class="progress progress-primary flex-1" [value]="progress()" max="100"></progress>
            <span class="text-xs font-mono opacity-50 shrink-0">{{ checkedIds().size }} / {{ totalLeaves() }}</span>
            <button class="btn btn-sm btn-ghost shrink-0" (click)="reset()" [disabled]="checkedIds().size === 0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
            </button>
            <button class="btn btn-sm btn-primary shrink-0" (click)="checkNext()" [disabled]="checkedIds().size >= totalLeaves()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Weiter
            </button>
        </header>

        <div class="join join-vertical flex-1 overflow-y-auto">
            @for (step of steps.value(); track step.id; let i = $index) {
                <app-macro-step
                    [step]="step"
                    [num]="i + 1"
                    [active]="i === activeStepIndex()"
                    [checkedIds]="checkedIds()"
                    (leafToggled)="toggle($event)"
                />
            }
        </div>
    `,
})
export class InstructionsComponent {

    #baseURI = inject(DOCUMENT).baseURI;
    route = inject(ActivatedRoute);
    id = toSignal(this.route.paramMap.pipe(map(p => p.get('id'))));
    steps = httpResource<MacroStep[]>(() => `${this.#baseURI}content/steps.json`);
    totalLeaves = computed(() => this.steps.hasValue() ? this.steps.value()?.flatMap(s => s.mids).flatMap(m => m.leaves).length : 1);

    checkedIds = signal<ReadonlySet<string>>(new Set());
    activeStepIndex = signal(0);
    progress = computed(() => this.totalLeaves ? (this.checkedIds().size / this.totalLeaves()) * 100 : 0);

    toggle(id: string): void {
        this.checkedIds.update(s => {
            const next = new Set(s);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
        const idx = this.activeStepIndex();
        if (!this.steps.hasValue()) return;
        if (idx < this.steps.value().length - 1) {
            const stepLeafIds = this.steps.value()[idx].mids.flatMap(m => m.leaves).map(l => l.id);
            if (stepLeafIds.every(id => this.checkedIds().has(id))) {
                this.activeStepIndex.set(idx + 1);
            }
        }
    }

    reset(): void {
        this.checkedIds.set(new Set());
        this.activeStepIndex.set(0);
    }

    checkNext(): void {
        if (!this.steps.hasValue()) return;
        const allIds = this.steps.value().flatMap(s => s.mids).flatMap(m => m.leaves).map(l => l.id);
        const nextId = allIds.find(id => !this.checkedIds().has(id));
        if (nextId) this.toggle(nextId);
    }
}
