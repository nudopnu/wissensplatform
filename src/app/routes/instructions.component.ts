import { AfterViewInit, Component, computed, signal } from '@angular/core';
import { MacroStepComponent } from '../components/macro-step.component';
import { MacroStep } from '../models/instruction';

const MOCK_STEPS: MacroStep[] = [
    {
        id: 'step-1',
        title: 'Vicon Kalibrierung',
        mids: [
            {
                id: 'mid-1-1',
                title: 'Kameras kalibrieren',
                leaves: [
                    { id: 'l-1-1-1', title: 'Auf den System Preparation Tab wechseln', info: '![](info/system-preparation-tab.gif)' },
                    { id: 'l-1-1-2', title: 'Unter Mask Cameras auf Start klicken, ein paar Sekunden warten und dann auf Stopp klicken' },
                    { id: 'l-1-1-3', title: 'Unter Calibrate Cameras auf Start klicken und mit dem Kalibrierstab Kalibrierungsframes aufzeichnen' },
                ],
            },
            {
                id: 'mid-1-2',
                title: 'Nullpunkt setzen',
                leaves: [
                    { id: 'l-1-2-1', title: 'Die Zentrierhilfe zwischen die Laufbänder stecken', info: '![](info/grail-origin-01.mp4)' },
                    { id: 'l-1-2-2', title: 'Den Kalibrierstab auf das Laufbandzentrum legen', info: '![](info/grail-origin-02.mp4)' },
                    { id: 'l-1-2-3', title: 'Unter Set Volume Origin auf Start klicken, 2–3 Sekunden warten und dann auf Stopp klicken' },
                ],
            },
        ],
    },
    {
        id: 'step-2',
        title: 'Subject Kalibrierung',
        mids: [
            {
                id: 'mid-2-1',
                title: 'Vorbereitung',
                leaves: [
                    { id: 'l-2-1-1', title: 'Einen neuen Trial anlegen' },
                    { id: 'l-2-1-2', title: 'Ein neues Skeleton (VSK) mit dem PlugIn Gait FullBody_vKAD Template (VST) erstellen', info: '![](info/vkad.png)' },
                    { id: 'l-2-1-3', title: 'Die Modellparameter Height (Höhe in Millimeter) und Mass (Gewicht in kg) eingeben' },
                ],
            },
            {
                id: 'mid-2-2',
                title: 'ROM-Trial aufzeichnen',
                leaves: [
                    { id: 'l-2-2-1', title: 'Den Patienten nach dem PlugIn Gait Markerset und den zwei zusätzlichen Kalibrierungsmarkern mit Markern versehen' },
                    { id: 'l-2-2-2', title: 'Den Patienten in Motorradfahrerposition in der Mitte des Grails mit Blickrichtung Leinwand stellen', info: '![](info/motorbike.png)' },
                    { id: 'l-2-2-3', title: 'Eine Aufzeichnung starten' },
                    { id: 'l-2-2-4', title: 'Nach ca. 3 Sekunden in der initialen Position soll der Patient die für die Aufzeichnung notwendige Range of Motion (ROM) vollführen' },
                    { id: 'l-2-2-5', title: 'Aufzeichnung beenden und öffnen' },
                ],
            },
            {
                id: 'mid-2-3',
                title: 'Postprocessing',
                leaves: [
                    { id: 'l-2-3-1', title: 'Mit geöffnetem ROM-Trial Reconstruct ausführen', info: '![](info/reconstruct.png)' },
                    { id: 'l-2-3-2', title: 'Die AutoInitialize Labeling-Pipeline ausführen', info: '![](info/auto-initialize.png)' },
                    { id: 'l-2-3-3', title: 'Start- und Endemarker (blaue Dreiecke) setzen, sodass sie die ersten Sekunden in der Anfangspose umfassen' },
                    { id: 'l-2-3-4', title: 'Process Static Subject Calibration ausführen', info: '![](info/static-subject-calibration.png)' },
                    { id: 'l-2-3-5', title: 'Process Static Plug-in Gait Model ausführen', info: '![](info/static-plugin-gait.png)' },
                    { id: 'l-2-3-6', title: 'VSK-Datei speichern' },
                    { id: 'l-2-3-7', title: 'Die Kalibrierungsmarker THI und TIB können nun entfernt werden' },
                ],
            },
        ],
    },
    {
        id: 'step-3',
        title: 'Bewegungsanalyse',
        mids: [
            {
                id: 'mid-3-1',
                title: 'Bewegungsaufzeichnung',
                leaves: [
                    { id: 'l-3-1-1', title: 'In den Live-Modus wechseln' },
                    { id: 'l-3-1-2', title: 'Aufzeichnung starten' },
                    { id: 'l-3-1-3', title: 'Den Patienten die gewünschten Bewegungen machen lassen' },
                    { id: 'l-3-1-4', title: 'Aufzeichnung beenden und öffnen' },
                ],
            },
            {
                id: 'mid-3-2',
                title: 'Postprocessing',
                leaves: [
                    { id: 'l-3-2-1', title: 'Die Pipeline 01_Dynamic öffnen' },
                    { id: 'l-3-2-2', title: 'Die Operation Combined Processing ausführen', info: '![](info/combined-processing.png)' },
                    { id: 'l-3-2-3', title: 'Trajektorien prüfen und Lücken füllen – fehlende Marker-Frames mit Fill Gaps schließen, anschließend Filter Trajectories (Woltring) anwenden' },
                    { id: 'l-3-2-4', title: 'Die Operation Kinematic Fit erneut ausführen – aktualisiert das Skeleton-Modell nach dem Gap Filling' },
                    { id: 'l-3-2-5', title: 'Die Operation Process Dynamic Plug-In Gait Model ausführen', info: '![](info/dynamic-plugin-gait.png)' },
                ],
            },
        ],
    },
];

@Component({
    host: { class: 'grow container mx-auto flex flex-col overflow-hidden' },
    imports: [MacroStepComponent],
    template: `
        <header class="p-3 flex items-center gap-4">
            <h1 class="font-mono font-semibold text-sm tracking-wide uppercase whitespace-nowrap">
                Plugin Gait · Protokoll
            </h1>
            <progress class="progress progress-primary flex-1" [value]="progress()" max="100"></progress>
            <span class="text-xs font-mono opacity-50 shrink-0">{{ checkedIds().size }} / {{ totalLeaves }}</span>
            <button class="btn btn-sm btn-ghost shrink-0" (click)="reset()" [disabled]="checkedIds().size === 0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
            </button>
            <button class="btn btn-sm btn-primary shrink-0" (click)="checkNext()" [disabled]="checkedIds().size >= totalLeaves">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Weiter
            </button>
        </header>

        <div class="join join-vertical flex-1 overflow-y-auto">
            @for (step of steps; track step.id; let i = $index) {
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
export class InstructionsComponent implements AfterViewInit {
    ngAfterViewInit(): void {
        console.log(JSON.stringify(MOCK_STEPS));
    }

    readonly steps = MOCK_STEPS;
    readonly totalLeaves = MOCK_STEPS.flatMap(s => s.mids).flatMap(m => m.leaves).length;

    checkedIds = signal<ReadonlySet<string>>(new Set());
    activeStepIndex = signal(0);
    progress = computed(() => this.totalLeaves ? (this.checkedIds().size / this.totalLeaves) * 100 : 0);

    toggle(id: string): void {
        this.checkedIds.update(s => {
            const next = new Set(s);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
        const idx = this.activeStepIndex();
        if (idx < this.steps.length - 1) {
            const stepLeafIds = this.steps[idx].mids.flatMap(m => m.leaves).map(l => l.id);
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
        const allIds = MOCK_STEPS.flatMap(s => s.mids).flatMap(m => m.leaves).map(l => l.id);
        const nextId = allIds.find(id => !this.checkedIds().has(id));
        if (nextId) this.toggle(nextId);
    }
}
