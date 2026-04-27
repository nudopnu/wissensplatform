import { Component, inject, input } from "@angular/core";
import { Card } from "../models/card";
import { Router } from "@angular/router";

@Component({
    selector: 'card',
    template: `
<div class="card card-side shadow-sm cursor-pointer" (click)="onclick()">
    <figure class="max-w-lg">
        <img [src]="'./' + card().img" alt="Movie" loading="lazy" />
    </figure>

    <div class="card-body">
        <article class="prose leading-tight">
            <h2 class="card-title">{{ card().title }}</h2>
            <p>{{ card().description }}</p>
            @if (card().sublinks) {
                <ul>
                    @for (sublink of card().sublinks; track $index) {
                        <li><a class="link">Vicon GRAIL Workflow – Kalibrierung & Bewegungsanalyse</a></li>
                    }
                </ul>
            }
        </article>
    </div>
</div>
    `,
})
export class CardComponent {
    card = input.required<Card>();
    tes = inject(Router);

    onclick() {
        this.tes.navigate(["/markerset"]);
    }
}