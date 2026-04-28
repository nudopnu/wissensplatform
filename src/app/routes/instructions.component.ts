import { Component, computed, signal } from '@angular/core';
import { MacroStepComponent } from '../components/macro-step.component';
import { MacroStep } from '../models/instruction';

const MOCK_STEPS: MacroStep[] = [
    {
        id: 'step-1',
        title: 'Patient Preparation',
        mids: [
            {
                id: 'mid-1-0',
                leaves: [
                    { id: 'l-1-0-1', title: 'Verify patient consent form is signed' },
                    { id: 'l-1-0-2', title: 'Confirm suitable footwear (flat-soled, no thick sole)' },
                ],
            },
            {
                id: 'mid-1-1',
                title: 'Anthropometric Measurements',
                leaves: [
                    { id: 'l-1-1-1', title: 'Record body height (cm) and mass (kg)' },
                    {
                        id: 'l-1-1-2',
                        title: 'Measure leg length — ASIS to medial malleolus',
                        info: '## Leg Length\n\nMeasure with patient **supine**.\n\nFrom the **anterior superior iliac spine (ASIS)** to the **medial malleolus**.\n\n- Record both legs separately\n- Repeat if values differ by > 5 mm',
                    },
                    { id: 'l-1-1-3', title: 'Measure knee width (medial to lateral epicondyle)' },
                    { id: 'l-1-1-4', title: 'Measure ankle width (medial to lateral malleolus)' },
                ],
            },
        ],
    },
    {
        id: 'step-2',
        title: 'Marker Placement',
        mids: [
            {
                id: 'mid-2-1',
                title: 'Pelvis',
                leaves: [
                    { id: 'l-2-1-1', title: 'RASI — right anterior superior iliac spine' },
                    { id: 'l-2-1-2', title: 'LASI — left anterior superior iliac spine' },
                    { id: 'l-2-1-3', title: 'RPSI — right posterior superior iliac spine' },
                    { id: 'l-2-1-4', title: 'LPSI — left posterior superior iliac spine' },
                ],
            },
            {
                id: 'mid-2-2',
                title: 'Right Lower Limb',
                leaves: [
                    {
                        id: 'l-2-2-1',
                        title: 'RTHI — lateral mid-thigh',
                        info: '## RTHI\n\nPlace midway between the greater trochanter and the lateral femoral epicondyle, on the **lateral** surface.\n\nAvoid placing over the iliotibial band (ITB) if the patient reports discomfort.',
                    },
                    { id: 'l-2-2-2', title: 'RKNE — lateral femoral epicondyle' },
                    { id: 'l-2-2-3', title: 'RTIB — lateral mid-shank' },
                    { id: 'l-2-2-4', title: 'RANK — lateral malleolus' },
                    { id: 'l-2-2-5', title: 'RHEE — calcaneus (heel)' },
                    { id: 'l-2-2-6', title: 'RTOE — 2nd metatarsal head' },
                ],
            },
            {
                id: 'mid-2-3',
                title: 'Left Lower Limb',
                leaves: [
                    { id: 'l-2-3-1', title: 'LTHI — lateral mid-thigh' },
                    { id: 'l-2-3-2', title: 'LKNE — lateral femoral epicondyle' },
                    { id: 'l-2-3-3', title: 'LTIB — lateral mid-shank' },
                    { id: 'l-2-3-4', title: 'LANK — lateral malleolus' },
                    { id: 'l-2-3-5', title: 'LHEE — calcaneus (heel)' },
                    { id: 'l-2-3-6', title: 'LTOE — 2nd metatarsal head' },
                ],
            },
        ],
    },
    {
        id: 'step-3',
        title: 'System Calibration',
        mids: [
            {
                id: 'mid-3-0',
                leaves: [
                    {
                        id: 'l-3-0-1',
                        title: 'Run static calibration trial (patient upright, 5 s)',
                        info: '## Static Trial\n\nPatient stands in **anatomical position**:\n\n- Arms slightly abducted\n- Feet parallel, shoulder-width apart\n- Eyes forward\n\nCapture for at least **5 seconds** with all markers fully visible to all cameras.',
                    },
                    { id: 'l-3-0-2', title: 'Verify all marker trajectories in Vicon Nexus' },
                    { id: 'l-3-0-3', title: 'Check residuals < 1 mm across all cameras' },
                ],
            },
        ],
    },
    {
        id: 'step-4',
        title: 'Data Collection',
        mids: [
            {
                id: 'mid-4-1',
                title: 'Walking Trials',
                leaves: [
                    { id: 'l-4-1-1', title: 'Instruct patient to walk at self-selected speed' },
                    { id: 'l-4-1-2', title: 'Collect minimum 5 valid walking trials' },
                    { id: 'l-4-1-3', title: 'Verify force plate strikes for each trial' },
                ],
            },
            {
                id: 'mid-4-2',
                title: 'Quality Check',
                leaves: [
                    { id: 'l-4-2-1', title: 'Review marker gaps — max 10 frames acceptable' },
                    { id: 'l-4-2-2', title: 'Confirm symmetric kinematics in preview' },
                    {
                        id: 'l-4-2-3',
                        title: 'Verify GRF waveform shape',
                        info: '## Ground Reaction Forces\n\nExpected **vertical GRF** for normal walking:\n\n1. First peak ~110% BW at ~15% stance\n2. Trough ~70% BW at ~50% stance\n3. Second peak ~110% BW at ~85% stance\n\nAnterior-posterior GRF: braking force early, propulsive force late in stance.',
                    },
                ],
            },
        ],
    },
];

@Component({
    host: { class: 'grow container mx-auto flex flex-col overflow-hidden' },
    imports: [MacroStepComponent],
    template: `
        <header class="shrink-0 border-b border-base-300 px-6 py-3 flex items-center gap-4">
            <h1 class="font-mono font-semibold text-sm tracking-wide uppercase whitespace-nowrap">
                Plugin Gait · Protocol
            </h1>
            <progress class="progress progress-primary flex-1 max-w-xs" [value]="progress()" max="100"></progress>
            <span class="text-xs font-mono opacity-50 shrink-0">{{ checkedIds().size }} / {{ totalLeaves }}</span>
        </header>
        <div class="join join-vertical flex-1 overflow-y-auto">
            @for (step of steps; track step.id; let i = $index) {
                <app-macro-step
                    [step]="step"
                    [num]="i + 1"
                    [checkedIds]="checkedIds()"
                    (leafToggled)="toggle($event)"
                />
            }
        </div>
    `,
})
export class InstructionsComponent {
    readonly steps = MOCK_STEPS;
    readonly totalLeaves = MOCK_STEPS.flatMap(s => s.mids).flatMap(m => m.leaves).length;

    checkedIds = signal<ReadonlySet<string>>(new Set());
    progress = computed(() => this.totalLeaves ? (this.checkedIds().size / this.totalLeaves) * 100 : 0);

    toggle(id: string): void {
        this.checkedIds.update(s => {
            const next = new Set(s);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }
}
